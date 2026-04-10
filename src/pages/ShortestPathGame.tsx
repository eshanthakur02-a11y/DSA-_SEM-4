import { useState, useCallback, useRef } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Layout from "@/components/Layout";
import { RotateCcw, Play, Eraser } from "lucide-react";

const ROWS = 20;
const COLS = 30;

type CellType = "empty" | "wall" | "start" | "end" | "visited" | "path";

const createGrid = (): CellType[][] =>
  Array.from({ length: ROWS }, () => Array(COLS).fill("empty"));

const cellColors: Record<CellType, string> = {
  empty: "bg-muted/30",
  wall: "bg-foreground/80",
  start: "bg-primary",
  end: "bg-neon-pink",
  visited: "bg-neon-purple/60",
  path: "bg-primary",
};

const ShortestPathGame = () => {
  const [grid, setGrid] = useState<CellType[][]>(createGrid);
  const [tool, setTool] = useState<"wall" | "start" | "end" | "erase">("wall");
  const [start, setStart] = useState<[number, number] | null>(null);
  const [end, setEnd] = useState<[number, number] | null>(null);
  const [running, setRunning] = useState(false);
  const [stats, setStats] = useState<{ visited: number; pathLen: number } | null>(null);
  const isDrawing = useRef(false);

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

  const runBFS = async () => {
    if (!start || !end) return;
    clearPath();
    setRunning(true);

    const g = grid.map((row) => [...row]);
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
        if (r === end[0] && c === end[1]) { found = true; break; }
        for (const [dr, dc] of dirs) {
          const nr = r + dr, nc = c + dc;
          const key = `${nr},${nc}`;
          if (nr >= 0 && nr < ROWS && nc >= 0 && nc < COLS && !visited.has(key) && g[nr][nc] !== "wall") {
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
      await new Promise((res) => setTimeout(res, 15));
    }

    // trace path
    let pathLen = 0;
    if (found) {
      let cur = `${end[0]},${end[1]}`;
      while (parent.has(cur)) {
        cur = parent.get(cur)!;
        const [pr, pc] = cur.split(",").map(Number);
        if (g[pr][pc] !== "start") { g[pr][pc] = "path"; pathLen++; }
        setGrid(g.map((row) => [...row]));
        await new Promise((res) => setTimeout(res, 20));
      }
    }

    setStats({ visited: visitCount, pathLen });
    setRunning(false);
  };

  const tools = [
    { id: "wall" as const, label: "Wall", icon: "▪" },
    { id: "start" as const, label: "Start", icon: "S" },
    { id: "end" as const, label: "End", icon: "E" },
    { id: "erase" as const, label: "Erase", icon: "✕" },
  ];

  return (
    <Layout>
      <section className="container py-20">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-8 text-center">
          <h1 className="font-display text-3xl font-bold neon-glow">Shortest Path Battle</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Place start & end points, draw walls, then run BFS to find the shortest path
          </p>
        </motion.div>

        {/* Toolbar */}
        <div className="mb-4 flex flex-wrap items-center justify-center gap-2">
          {tools.map((t) => (
            <Button
              key={t.id}
              size="sm"
              variant={tool === t.id ? "default" : "outline"}
              className={`font-display text-xs ${tool === t.id ? "bg-primary text-primary-foreground" : "border-border text-muted-foreground hover:text-foreground"}`}
              onClick={() => setTool(t.id)}
            >
              {t.icon} {t.label}
            </Button>
          ))}
          <div className="mx-2 h-6 w-px bg-border" />
          <Button
            size="sm"
            className="gap-1 bg-primary font-display text-xs text-primary-foreground hover:bg-primary/90"
            onClick={runBFS}
            disabled={running || !start || !end}
          >
            <Play className="h-3 w-3" /> Run BFS
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="gap-1 border-border font-display text-xs text-muted-foreground hover:text-foreground"
            onClick={reset}
          >
            <RotateCcw className="h-3 w-3" /> Reset
          </Button>
        </div>

        {stats && (
          <div className="mb-4 flex justify-center gap-6 text-sm">
            <span className="text-neon-purple">Visited: <strong>{stats.visited}</strong></span>
            <span className="text-primary">Path length: <strong>{stats.pathLen}</strong></span>
          </div>
        )}

        {/* Grid */}
        <div className="mx-auto overflow-x-auto">
          <div
            className="mx-auto w-fit select-none rounded-lg border border-border p-1 neon-border"
            onMouseLeave={() => { isDrawing.current = false; }}
          >
            {grid.map((row, r) => (
              <div key={r} className="flex">
                {row.map((cell, c) => (
                  <div
                    key={c}
                    className={`h-5 w-5 border border-border/30 transition-colors duration-100 cursor-pointer ${cellColors[cell]}`}
                    onMouseDown={() => { isDrawing.current = true; handleCell(r, c); }}
                    onMouseEnter={() => { if (isDrawing.current && (tool === "wall" || tool === "erase")) handleCell(r, c); }}
                    onMouseUp={() => { isDrawing.current = false; }}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default ShortestPathGame;
