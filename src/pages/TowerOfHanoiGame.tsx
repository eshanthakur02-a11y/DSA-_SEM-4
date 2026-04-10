import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import Layout from "@/components/Layout";
import GameLayout from "@/components/GameLayout";
import { RotateCcw, Play, Minus, Plus } from "lucide-react";

const COLORS = [
  "hsl(160, 100%, 50%)",
  "hsl(270, 75%, 58%)",
  "hsl(185, 100%, 55%)",
  "hsl(330, 90%, 60%)",
  "hsl(33, 100%, 55%)",
  "hsl(192, 100%, 50%)",
  "hsl(60, 90%, 55%)",
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
      if (selected === rodIdx) { setSelected(null); return; }
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

  const maxDiskWidth = 180;
  const minDiskWidth = 40;

  const sidebarContent = (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <span className="text-xs text-muted-foreground font-display">Disks:</span>
        <Button size="icon" variant="outline" className="h-7 w-7" onClick={() => { const n = Math.max(2, numDisks - 1); setNumDisks(n); resetGame(n); }} disabled={autoSolving}>
          <Minus className="h-3 w-3" />
        </Button>
        <span className="w-6 text-center font-display font-bold text-foreground">{numDisks}</span>
        <Button size="icon" variant="outline" className="h-7 w-7" onClick={() => { const n = Math.min(7, numDisks + 1); setNumDisks(n); resetGame(n); }} disabled={autoSolving}>
          <Plus className="h-3 w-3" />
        </Button>
      </div>
      <Button size="sm" variant="neonCyan" className="w-full gap-1" onClick={autoSolve} disabled={autoSolving}>
        <Play className="h-3 w-3" /> Auto-Solve
      </Button>
      <Button size="sm" variant="outline" className="w-full gap-1" onClick={() => resetGame(numDisks)}>
        <RotateCcw className="h-3 w-3" /> Reset
      </Button>
      <div className="border-t border-border pt-3 text-xs text-muted-foreground space-y-1">
        <p><strong className="text-foreground">Rules:</strong></p>
        <p>• Move one disk at a time</p>
        <p>• Only top disk can be moved</p>
        <p>• No larger disk on smaller</p>
      </div>
    </div>
  );

  return (
    <Layout>
      <GameLayout
        title="Tower of Hanoi"
        glowClass="neon-glow-cyan"
        stats={[
          { label: "Moves", value: moves, color: "text-foreground" },
          { label: "Minimum", value: minMoves, color: "text-neon-cyan" },
        ]}
        explanation={{
          title: "Recursive Solution",
          content: "To move n disks from A to C: 1) Move n-1 disks from A to B (using C as auxiliary). 2) Move the largest disk from A to C. 3) Move n-1 disks from B to C (using A as auxiliary). This always takes exactly 2^n - 1 moves."
        }}
        sidebarContent={sidebarContent}
      >
        {won && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="mb-6 rounded-xl border border-primary bg-primary/10 p-4 text-center neon-border mx-auto max-w-md"
          >
            <p className="font-display text-lg font-bold text-primary">
              🎉 Solved in {moves} moves! {moves === minMoves ? "Perfect!" : `(Optimal: ${minMoves})`}
            </p>
          </motion.div>
        )}

        {/* Progress */}
        <div className="mx-auto max-w-xs mb-8">
          <div className="flex justify-between text-[10px] text-muted-foreground mb-1 font-display">
            <span>Progress</span>
            <span>{rods[2].length}/{numDisks} disks moved</span>
          </div>
          <div className="xp-bar">
            <div
              className="xp-bar-fill"
              style={{
                width: `${(rods[2].length / numDisks) * 100}%`,
                background: "linear-gradient(90deg, hsl(var(--neon-cyan)), hsl(var(--neon-blue)))",
              }}
            />
          </div>
        </div>

        {/* Rods */}
        <div className="flex justify-center gap-6 sm:gap-12">
          {rods.map((rod, rodIdx) => (
            <div
              key={rodIdx}
              className={`flex cursor-pointer flex-col items-center transition-all duration-200 rounded-xl p-2 ${
                selected === rodIdx
                  ? "bg-primary/10 ring-2 ring-primary/50"
                  : "hover:bg-muted/20"
              }`}
              onClick={() => handleRodClick(rodIdx)}
            >
              <div className="relative flex h-52 w-48 flex-col items-center justify-end pb-1">
                {/* Pole */}
                <div className="absolute bottom-0 left-1/2 h-full w-1.5 -translate-x-1/2 rounded-full bg-muted-foreground/20" />
                {/* Base */}
                <div className="absolute bottom-0 h-1.5 w-40 rounded-full bg-muted-foreground/20" />
                {/* Disks */}
                <AnimatePresence>
                  {rod.map((disk, diskIdx) => {
                    const width = minDiskWidth + ((disk - 1) / (numDisks - 1 || 1)) * (maxDiskWidth - minDiskWidth);
                    return (
                      <motion.div
                        key={disk}
                        layout
                        initial={{ opacity: 0, y: -30, scale: 0.8 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -30, scale: 0.8 }}
                        transition={{ type: "spring", stiffness: 300, damping: 25 }}
                        className="z-10 rounded-lg"
                        style={{
                          width: `${width}px`,
                          height: "22px",
                          backgroundColor: COLORS[(disk - 1) % COLORS.length],
                          marginBottom: diskIdx === 0 ? 0 : -1,
                          boxShadow: `0 0 12px ${COLORS[(disk - 1) % COLORS.length]}50, inset 0 1px 0 rgba(255,255,255,0.2)`,
                        }}
                      />
                    );
                  })}
                </AnimatePresence>
              </div>
              <span className="mt-3 font-display text-xs text-muted-foreground">
                {rodIdx === 0 ? "Source" : rodIdx === 1 ? "Auxiliary" : "Target"}
              </span>
            </div>
          ))}
        </div>
      </GameLayout>
    </Layout>
  );
};

export default TowerOfHanoiGame;
