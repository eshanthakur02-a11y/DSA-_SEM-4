import { useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import Layout from "@/components/Layout";
import {
  RotateCcw,
  Play,
  Eraser,
  Flag,
  MapPin,
  Square,
  Shuffle,
  Gauge,
  Sparkles,
  Trophy,
  Footprints,
} from "lucide-react";

const ROWS = 20;
const COLS = 30;

type CellType = "empty" | "wall" | "start" | "end" | "visited" | "path";
type Tool = "wall" | "start" | "end" | "erase";

const createGrid = (): CellType[][] =>
  Array.from({ length: ROWS }, () => Array(COLS).fill("empty"));

const cellClasses: Record<CellType, string> = {
  empty: "bg-muted/20 hover:bg-muted/50",
  wall: "bg-foreground shadow-[inset_0_0_4px_hsl(var(--background))]",
  start: "bg-primary shadow-[0_0_10px_hsl(var(--primary))]",
  end: "bg-neon-pink shadow-[0_0_10px_hsl(330_90%_60%)]",
  visited: "bg-neon-purple/70 shadow-[0_0_6px_hsl(270_80%_60%/0.5)]",
  path: "bg-neon-cyan shadow-[0_0_10px_hsl(185_100%_55%)]",
};

const ShortestPathGame = () => {
  const [grid, setGrid] = useState<CellType[][]>(createGrid);
  const [tool, setTool] = useState<Tool>("wall");
  const [start, setStart] = useState<[number, number] | null>(null);
  const [end, setEnd] = useState<[number, number] | null>(null);
  const [running, setRunning] = useState(false);
  const [stats, setStats] = useState<{ visited: number; pathLen: number } | null>(null);
  const [speed, setSpeed] = useState<"slow" | "normal" | "fast">("normal");
  const isDrawing = useRef(false);

  const speedMs = speed === "slow" ? 40 : speed === "fast" ? 5 : 15;

  const handleCell = useCallback(
    (r: number, c: number) => {
      if (running) return;
      setGrid((prev) => {
        const g = prev.map((row) => [...row]);
        if (tool === "start") {
          if (start) g[start[0]][start[1]] = "empty";
          g[r][c] = "start";
          setStart([r, c]);
        } else if (tool === "end") {
          if (end) g[end[0]][end[1]] = "empty";
          g[r][c] = "end";
          setEnd([r, c]);
        } else if (tool === "erase") {
          if (g[r][c] === "start") setStart(null);
          if (g[r][c] === "end") setEnd(null);
          g[r][c] = "empty";
        } else {
          if (g[r][c] === "empty") g[r][c] = "wall";
        }
        return g;
      });
    },
    [tool, start, end, running]
  );

  const reset = () => {
    setGrid(createGrid());
    setStart(null);
    setEnd(null);
    setStats(null);
    setRunning(false);
  };

  const clearPath = () => {
    setGrid((prev) =>
      prev.map((row) =>
        row.map((c) => (c === "visited" || c === "path" ? "empty" : c))
      )
    );
    setStats(null);
  };

  const randomMaze = () => {
    if (running) return;
    const g = createGrid();
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        if (Math.random() < 0.28) g[r][c] = "wall";
      }
    }
    const s: [number, number] = [Math.floor(Math.random() * ROWS), 0];
    const e: [number, number] = [Math.floor(Math.random() * ROWS), COLS - 1];
    g[s[0]][s[1]] = "start";
    g[e[0]][e[1]] = "end";
    setGrid(g);
    setStart(s);
    setEnd(e);
    setStats(null);
  };

  const runBFS = async () => {
    if (!start || !end) return;
    clearPath();
    setRunning(true);

    const g = grid.map((row) => [...row]);
    // ensure cleared
    for (let r = 0; r < ROWS; r++)
      for (let c = 0; c < COLS; c++)
        if (g[r][c] === "visited" || g[r][c] === "path") g[r][c] = "empty";

    const visited = new Set<string>();
    const parent = new Map<string, string>();
    const queue: [number, number][] = [start];
    visited.add(`${start[0]},${start[1]}`);
    const dirs = [[-1, 0], [1, 0], [0, -1], [0, 1]];
    let found = false;
    let visitCount = 0;

    while (queue.length > 0 && !found) {
      const batch = queue.splice(0, Math.min(3, queue.length));
      for (const [r, c] of batch) {
        if (r === end[0] && c === end[1]) {
          found = true;
          break;
        }
        for (const [dr, dc] of dirs) {
          const nr = r + dr,
            nc = c + dc;
          const key = `${nr},${nc}`;
          if (
            nr >= 0 &&
            nr < ROWS &&
            nc >= 0 &&
            nc < COLS &&
            !visited.has(key) &&
            g[nr][nc] !== "wall"
          ) {
            visited.add(key);
            parent.set(key, `${r},${c}`);
            queue.push([nr, nc]);
            if (g[nr][nc] !== "start" && g[nr][nc] !== "end") {
              g[nr][nc] = "visited";
              visitCount++;
            }
          }
        }
      }
      setGrid(g.map((row) => [...row]));
      await new Promise((res) => setTimeout(res, speedMs));
    }

    let pathLen = 0;
    if (found) {
      let cur = `${end[0]},${end[1]}`;
      while (parent.has(cur)) {
        cur = parent.get(cur)!;
        const [pr, pc] = cur.split(",").map(Number);
        if (g[pr][pc] !== "start") {
          g[pr][pc] = "path";
          pathLen++;
        }
        setGrid(g.map((row) => [...row]));
        await new Promise((res) => setTimeout(res, 25));
      }
    }

    setStats({ visited: visitCount, pathLen });
    setRunning(false);
  };

  const tools: { id: Tool; label: string; icon: typeof Square; color: string }[] = [
    { id: "start", label: "Start", icon: MapPin, color: "text-primary" },
    { id: "end", label: "End", icon: Flag, color: "text-neon-pink" },
    { id: "wall", label: "Wall", icon: Square, color: "text-foreground" },
    { id: "erase", label: "Erase", icon: Eraser, color: "text-muted-foreground" },
  ];

  const speeds: { id: typeof speed; label: string }[] = [
    { id: "slow", label: "Slow" },
    { id: "normal", label: "Normal" },
    { id: "fast", label: "Fast" },
  ];

  const ready = !!start && !!end;

  return (
    <Layout>
      <section className="container py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 text-center"
        >
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-4 py-1.5 text-xs font-display text-primary">
            <Sparkles className="h-3 w-3" />
            BFS Pathfinding Visualizer
          </div>
          <h1 className="font-display text-4xl font-bold neon-glow sm:text-5xl">
            Shortest Path Battle
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-sm text-muted-foreground">
            Drop a start & end, sketch walls, then watch BFS sweep the grid to
            uncover the shortest route.
          </p>
        </motion.div>

        <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
          {/* Sidebar */}
          <motion.aside
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-4"
          >
            {/* Tools card */}
            <div className="rounded-xl border border-border/60 bg-card/40 p-4 backdrop-blur">
              <h3 className="mb-3 font-display text-xs uppercase tracking-wider text-muted-foreground">
                Tools
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {tools.map((t) => {
                  const Icon = t.icon;
                  const active = tool === t.id;
                  return (
                    <button
                      key={t.id}
                      onClick={() => setTool(t.id)}
                      disabled={running}
                      className={`group relative flex flex-col items-center gap-1 rounded-lg border p-3 transition-all ${
                        active
                          ? "border-primary bg-primary/10 shadow-[0_0_15px_hsl(var(--primary)/0.3)]"
                          : "border-border/50 bg-background/30 hover:border-border hover:bg-background/60"
                      }`}
                    >
                      <Icon
                        className={`h-4 w-4 ${active ? "text-primary" : t.color}`}
                      />
                      <span
                        className={`font-display text-[10px] uppercase tracking-wide ${
                          active ? "text-primary" : "text-muted-foreground"
                        }`}
                      >
                        {t.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Speed card */}
            <div className="rounded-xl border border-border/60 bg-card/40 p-4 backdrop-blur">
              <h3 className="mb-3 flex items-center gap-1.5 font-display text-xs uppercase tracking-wider text-muted-foreground">
                <Gauge className="h-3 w-3" /> Speed
              </h3>
              <div className="flex gap-1 rounded-lg border border-border/50 bg-background/30 p-1">
                {speeds.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setSpeed(s.id)}
                    disabled={running}
                    className={`flex-1 rounded-md py-1.5 font-display text-[10px] uppercase tracking-wide transition-colors ${
                      speed === s.id
                        ? "bg-primary/20 text-primary"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-2">
              <Button
                className="w-full gap-2 bg-primary font-display text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
                onClick={runBFS}
                disabled={running || !ready}
              >
                <Play className="h-4 w-4" />
                {running ? "Running…" : "Run BFS"}
              </Button>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="gap-1 border-border/60 font-display text-xs"
                  onClick={randomMaze}
                  disabled={running}
                >
                  <Shuffle className="h-3 w-3" /> Maze
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="gap-1 border-border/60 font-display text-xs"
                  onClick={reset}
                  disabled={running}
                >
                  <RotateCcw className="h-3 w-3" /> Reset
                </Button>
              </div>
            </div>

            {/* Legend */}
            <div className="rounded-xl border border-border/60 bg-card/40 p-4 backdrop-blur">
              <h3 className="mb-3 font-display text-xs uppercase tracking-wider text-muted-foreground">
                Legend
              </h3>
              <ul className="space-y-2 text-xs">
                {[
                  { c: "bg-primary", l: "Start" },
                  { c: "bg-neon-pink", l: "End" },
                  { c: "bg-foreground", l: "Wall" },
                  { c: "bg-neon-purple/70", l: "Visited" },
                  { c: "bg-neon-cyan", l: "Shortest path" },
                ].map((i) => (
                  <li key={i.l} className="flex items-center gap-2">
                    <span className={`h-3 w-3 rounded-sm ${i.c}`} />
                    <span className="text-muted-foreground">{i.l}</span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.aside>

          {/* Main grid area */}
          <div className="space-y-4">
            {/* Status bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border/60 bg-card/40 px-4 py-3 backdrop-blur">
              <div className="flex items-center gap-2 text-xs">
                <span
                  className={`h-2 w-2 rounded-full ${
                    running
                      ? "animate-pulse bg-neon-purple"
                      : ready
                      ? "bg-primary"
                      : "bg-muted-foreground/50"
                  }`}
                />
                <span className="font-display uppercase tracking-wider text-muted-foreground">
                  {running
                    ? "Searching…"
                    : ready
                    ? "Ready to run"
                    : !start
                    ? "Place a start point"
                    : "Place an end point"}
                </span>
              </div>

              <AnimatePresence mode="wait">
                {stats ? (
                  <motion.div
                    key="stats"
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center gap-4 text-xs"
                  >
                    <span className="flex items-center gap-1.5 text-neon-purple">
                      <Footprints className="h-3 w-3" /> Visited{" "}
                      <strong className="font-display">{stats.visited}</strong>
                    </span>
                    <span className="flex items-center gap-1.5 text-neon-cyan">
                      <Trophy className="h-3 w-3" /> Path{" "}
                      <strong className="font-display">
                        {stats.pathLen || "—"}
                      </strong>
                    </span>
                  </motion.div>
                ) : (
                  <motion.span
                    key="hint"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-xs text-muted-foreground/70"
                  >
                    Tip: drag to draw walls
                  </motion.span>
                )}
              </AnimatePresence>
            </div>

            {/* Grid */}
            <div className="overflow-x-auto">
              <div
                className="mx-auto w-fit select-none rounded-xl border border-primary/20 bg-background/40 p-2 shadow-[0_0_30px_hsl(var(--primary)/0.1)] backdrop-blur"
                onMouseLeave={() => {
                  isDrawing.current = false;
                }}
                onMouseUp={() => {
                  isDrawing.current = false;
                }}
              >
                {grid.map((row, r) => (
                  <div key={r} className="flex">
                    {row.map((cell, c) => (
                      <div
                        key={c}
                        className={`h-5 w-5 border border-border/20 transition-all duration-150 cursor-pointer ${cellClasses[cell]} ${
                          cell === "visited" || cell === "path"
                            ? "scale-100"
                            : "hover:scale-110"
                        }`}
                        onMouseDown={(e) => {
                          e.preventDefault();
                          isDrawing.current = true;
                          handleCell(r, c);
                        }}
                        onMouseEnter={() => {
                          if (
                            isDrawing.current &&
                            (tool === "wall" || tool === "erase")
                          )
                            handleCell(r, c);
                        }}
                      />
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default ShortestPathGame;
