import { useState, useCallback, useRef } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Layout from "@/components/Layout";
import GameLayout from "@/components/GameLayout";
import { RotateCcw, Play, Eraser, MapPin, Flag, Layers } from "lucide-react";

const ROWS = 20;
const COLS = 30;

type CellType = "empty" | "wall" | "start" | "end" | "visited" | "path";

const createGrid = (): CellType[][] =>
  Array.from({ length: ROWS }, () => Array(COLS).fill("empty"));

const cellColors: Record<CellType, string> = {
  empty: "bg-muted/20 hover:bg-muted/40",
  wall: "bg-foreground/80 shadow-[inset_0_0_4px_rgba(255,255,255,0.1)]",
  start: "bg-primary shadow-[0_0_8px_hsl(var(--primary)/0.6)]",
  end: "bg-neon-pink shadow-[0_0_8px_hsl(var(--neon-pink)/0.6)]",
  visited: "bg-neon-purple/50 shadow-[0_0_4px_hsl(var(--neon-purple)/0.3)]",
  path: "bg-primary shadow-[0_0_10px_hsl(var(--primary)/0.5)]",
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
    { id: "wall" as const, label: "Wall", icon: <Layers className="h-3 w-3" /> },
    { id: "start" as const, label: "Start", icon: <MapPin className="h-3 w-3" /> },
    { id: "end" as const, label: "End", icon: <Flag className="h-3 w-3" /> },
    { id: "erase" as const, label: "Erase", icon: <Eraser className="h-3 w-3" /> },
  ];

  const sidebarContent = (
    <div className="space-y-3">
      {tools.map((t) => (
        <Button
          key={t.id}
          size="sm"
          variant={tool === t.id ? "neonGreen" : "outline"}
          className="w-full justify-start gap-2"
          onClick={() => setTool(t.id)}
        >
          {t.icon} {t.label}
        </Button>
      ))}
      <div className="border-t border-border pt-3 space-y-2">
        <Button
          size="sm"
          variant="neonGreen"
          className="w-full gap-1"
          onClick={runBFS}
          disabled={running || !start || !end}
        >
          <Play className="h-3 w-3" /> Run BFS
        </Button>
        <Button
          size="sm"
          variant="outline"
          className="w-full gap-1"
          onClick={reset}
        >
          <RotateCcw className="h-3 w-3" /> Reset
        </Button>
      </div>
    </div>
  );

  return (
    <Layout>
      <GameLayout
        title="Shortest Path Battle"
        glowClass="neon-glow"
        stats={[
          ...(stats ? [
            { label: "Visited", value: stats.visited, color: "text-neon-purple" },
            { label: "Path", value: stats.pathLen, color: "text-primary" },
          ] : []),
        ]}
        explanation={{
          title: "BFS (Breadth-First Search)",
          content: "BFS explores all neighbors at the current depth before moving to nodes at the next depth level. It guarantees the shortest path in unweighted graphs by expanding outward like ripples in water."
        }}
        sidebarContent={sidebarContent}
      >
        {/* Toolbar (compact, above grid) */}
        <div className="mb-4 flex flex-wrap items-center justify-center gap-2 md:hidden">
          {tools.map((t) => (
            <Button
              key={t.id}
              size="sm"
              variant={tool === t.id ? "neonGreen" : "outline"}
              className="gap-1"
              onClick={() => setTool(t.id)}
            >
              {t.icon} {t.label}
            </Button>
          ))}
          <Button size="sm" variant="neonGreen" className="gap-1" onClick={runBFS} disabled={running || !start || !end}>
            <Play className="h-3 w-3" /> BFS
          </Button>
          <Button size="sm" variant="outline" className="gap-1" onClick={reset}>
            <RotateCcw className="h-3 w-3" /> Reset
          </Button>
        </div>

        {/* Grid */}
        <div className="mx-auto overflow-x-auto">
          <div
            className="mx-auto w-fit select-none rounded-xl border border-border p-1 neon-border bg-card/30"
            onMouseLeave={() => { isDrawing.current = false; }}
          >
            {grid.map((row, r) => (
              <div key={r} className="flex">
                {row.map((cell, c) => (
                  <div
                    key={c}
                    className={`h-5 w-5 border border-border/20 transition-all duration-150 cursor-pointer ${cellColors[cell]}`}
                    onMouseDown={() => { isDrawing.current = true; handleCell(r, c); }}
                    onMouseEnter={() => { if (isDrawing.current && (tool === "wall" || tool === "erase")) handleCell(r, c); }}
                    onMouseUp={() => { isDrawing.current = false; }}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Log */}
        {stats && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mx-auto mt-4 max-w-md game-panel text-center text-sm"
          >
            BFS explored <strong className="text-neon-purple">{stats.visited}</strong> nodes
            {stats.pathLen > 0
              ? <> and found a path of length <strong className="text-primary">{stats.pathLen}</strong></>
              : <> but <strong className="text-destructive">no path found</strong></>
            }
          </motion.div>
        )}
      </GameLayout>
    </Layout>
  );
};

export default ShortestPathGame;
