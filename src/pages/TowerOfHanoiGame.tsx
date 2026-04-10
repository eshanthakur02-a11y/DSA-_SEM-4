import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import Layout from "@/components/Layout";
import { RotateCcw, Play, Minus, Plus } from "lucide-react";

const COLORS = [
  "hsl(160, 100%, 50%)",
  "hsl(270, 80%, 60%)",
  "hsl(185, 100%, 55%)",
  "hsl(330, 90%, 60%)",
  "hsl(25, 100%, 55%)",
  "hsl(60, 90%, 55%)",
  "hsl(200, 100%, 55%)",
];

const TowerOfHanoiGame = () => {
  const [numDisks, setNumDisks] = useState(4);
  const [rods, setRods] = useState<number[][]>(() => [
    Array.from({ length: 4 }, (_, i) => 4 - i),
    [],
    [],
  ]);
  const [selected, setSelected] = useState<number | null>(null);
  const [moves, setMoves] = useState(0);
  const [autoSolving, setAutoSolving] = useState(false);
  const cancelRef = useRef(false);

  const minMoves = Math.pow(2, numDisks) - 1;
  const won = rods[2].length === numDisks && !autoSolving;

  const resetGame = useCallback((disks: number) => {
    cancelRef.current = true;
    setTimeout(() => {
      setRods([Array.from({ length: disks }, (_, i) => disks - i), [], []]);
      setMoves(0);
      setSelected(null);
      setAutoSolving(false);
      cancelRef.current = false;
    }, 50);
  }, []);

  const handleRodClick = (rodIdx: number) => {
    if (autoSolving) return;
    if (selected === null) {
      if (rods[rodIdx].length > 0) setSelected(rodIdx);
    } else {
      if (selected === rodIdx) {
        setSelected(null);
        return;
      }
      const disk = rods[selected][rods[selected].length - 1];
      const topDisk = rods[rodIdx].length > 0 ? rods[rodIdx][rods[rodIdx].length - 1] : Infinity;
      if (disk < topDisk) {
        setRods((prev) => {
          const next = prev.map((r) => [...r]);
          next[selected].pop();
          next[rodIdx].push(disk);
          return next;
        });
        setMoves((m) => m + 1);
      }
      setSelected(null);
    }
  };

  const autoSolve = async () => {
    cancelRef.current = false;
    setAutoSolving(true);
    const currentRods: number[][] = [
      Array.from({ length: numDisks }, (_, i) => numDisks - i),
      [],
      [],
    ];
    setRods(currentRods.map((r) => [...r]));
    setMoves(0);

    const moveDisk = async (from: number, to: number) => {
      if (cancelRef.current) throw new Error("cancelled");
      const disk = currentRods[from].pop()!;
      currentRods[to].push(disk);
      setRods(currentRods.map((r) => [...r]));
      setMoves((m) => m + 1);
      await new Promise((res) => setTimeout(res, 300));
    };

    const solve = async (n: number, from: number, to: number, aux: number) => {
      if (n === 0) return;
      await solve(n - 1, from, aux, to);
      await moveDisk(from, to);
      await solve(n - 1, aux, to, from);
    };

    try {
      await solve(numDisks, 0, 2, 1);
    } catch {
      // cancelled
    }
    setAutoSolving(false);
  };

  const maxDiskWidth = 160;
  const minDiskWidth = 40;

  return (
    <Layout>
      <section className="container max-w-4xl py-20">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-8 text-center">
          <h1 className="font-display text-3xl font-bold neon-glow-cyan">Tower of Hanoi</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Move all disks to the rightmost rod
          </p>
        </motion.div>

        {/* Controls */}
        <div className="mb-6 flex flex-wrap items-center justify-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground font-display">Disks:</span>
            <Button
              size="icon"
              variant="outline"
              className="h-7 w-7 border-border text-muted-foreground hover:text-foreground"
              onClick={() => { const n = Math.max(2, numDisks - 1); setNumDisks(n); resetGame(n); }}
              disabled={autoSolving}
            >
              <Minus className="h-3 w-3" />
            </Button>
            <span className="w-6 text-center font-display font-bold text-foreground">{numDisks}</span>
            <Button
              size="icon"
              variant="outline"
              className="h-7 w-7 border-border text-muted-foreground hover:text-foreground"
              onClick={() => { const n = Math.min(7, numDisks + 1); setNumDisks(n); resetGame(n); }}
              disabled={autoSolving}
            >
              <Plus className="h-3 w-3" />
            </Button>
          </div>
          <Button
            size="sm"
            className="gap-1 bg-neon-cyan font-display text-xs text-accent-foreground hover:bg-neon-cyan/80"
            onClick={autoSolve}
            disabled={autoSolving}
          >
            <Play className="h-3 w-3" /> Auto-Solve
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="gap-1 border-border font-display text-xs text-muted-foreground hover:text-foreground"
            onClick={() => resetGame(numDisks)}
          >
            <RotateCcw className="h-3 w-3" /> Reset
          </Button>
        </div>

        {/* Stats */}
        <div className="mb-8 flex justify-center gap-8 text-sm">
          <span className="text-muted-foreground">Moves: <strong className="text-foreground">{moves}</strong></span>
          <span className="text-muted-foreground">Minimum: <strong className="text-neon-cyan">{minMoves}</strong></span>
        </div>

        {won && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="mb-8 rounded-xl border border-primary bg-primary/10 p-4 text-center neon-border"
          >
            <p className="font-display text-lg font-bold text-primary">
              🎉 Solved in {moves} moves! {moves === minMoves ? "Perfect!" : `(Optimal: ${minMoves})`}
            </p>
          </motion.div>
        )}

        {/* Rods */}
        <div className="flex justify-center gap-4 sm:gap-8">
          {rods.map((rod, rodIdx) => (
            <div
              key={rodIdx}
              className={`flex cursor-pointer flex-col items-center ${
                selected === rodIdx ? "ring-2 ring-primary rounded-lg" : ""
              }`}
              onClick={() => handleRodClick(rodIdx)}
            >
              {/* Rod visual */}
              <div className="relative flex h-48 w-44 flex-col items-center justify-end pb-1">
                {/* Pole */}
                <div className="absolute bottom-0 left-1/2 h-full w-1 -translate-x-1/2 rounded-full bg-muted-foreground/30" />
                {/* Base */}
                <div className="absolute bottom-0 h-1 w-36 rounded-full bg-muted-foreground/30" />
                {/* Disks */}
                <AnimatePresence>
                  {rod.map((disk, diskIdx) => {
                    const width =
                      minDiskWidth +
                      ((disk - 1) / (numDisks - 1 || 1)) * (maxDiskWidth - minDiskWidth);
                    return (
                      <motion.div
                        key={disk}
                        layout
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="z-10 rounded-md"
                        style={{
                          width: `${width}px`,
                          height: "20px",
                          backgroundColor: COLORS[(disk - 1) % COLORS.length],
                          marginBottom: diskIdx === 0 ? 0 : -2,
                          boxShadow: `0 0 8px ${COLORS[(disk - 1) % COLORS.length]}40`,
                        }}
                      />
                    );
                  })}
                </AnimatePresence>
              </div>
              <span className="mt-2 font-display text-xs text-muted-foreground">
                {rodIdx === 0 ? "A" : rodIdx === 1 ? "B" : "C"}
              </span>
            </div>
          ))}
        </div>
      </section>
    </Layout>
  );
};

export default TowerOfHanoiGame;
