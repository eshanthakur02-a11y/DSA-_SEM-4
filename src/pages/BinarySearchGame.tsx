import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Layout from "@/components/Layout";
import GameLayout from "@/components/GameLayout";
import { RotateCcw, ArrowUp, ArrowDown, Check, Sparkles } from "lucide-react";

const BinarySearchGame = () => {
  const [target, setTarget] = useState(() => Math.floor(Math.random() * 1000) + 1);
  const [guess, setGuess] = useState("");
  const [lo, setLo] = useState(1);
  const [hi, setHi] = useState(1000);
  const [attempts, setAttempts] = useState(0);
  const [history, setHistory] = useState<{ val: number; result: string }[]>([]);
  const [won, setWon] = useState(false);

  const optimalSteps = Math.ceil(Math.log2(1000));

  const handleGuess = useCallback(() => {
    const val = parseInt(guess);
    if (isNaN(val) || val < 1 || val > 1000) return;
    setAttempts((a) => a + 1);
    if (val === target) {
      setHistory((h) => [...h, { val, result: "correct" }]);
      setWon(true);
    } else if (val < target) {
      setHistory((h) => [...h, { val, result: "low" }]);
      setLo(Math.max(lo, val + 1));
    } else {
      setHistory((h) => [...h, { val, result: "high" }]);
      setHi(Math.min(hi, val - 1));
    }
    setGuess("");
  }, [guess, target, lo, hi]);

  const reset = () => {
    setTarget(Math.floor(Math.random() * 1000) + 1);
    setGuess("");
    setLo(1);
    setHi(1000);
    setAttempts(0);
    setHistory([]);
    setWon(false);
  };

  const score = won ? Math.max(0, 100 - (attempts - optimalSteps) * 10) : null;

  const sidebarContent = (
    <div className="space-y-3">
      <div className="text-xs text-muted-foreground space-y-1">
        <p><strong className="text-foreground">Goal:</strong> Find the hidden number</p>
        <p><strong className="text-foreground">Range:</strong> 1 – 1000</p>
        <p><strong className="text-foreground">Strategy:</strong> Always guess the midpoint of your range!</p>
      </div>
      <div className="border-t border-border pt-3">
        <p className="text-xs text-muted-foreground mb-1">Optimal midpoint:</p>
        <p className="font-display text-lg font-bold text-neon-purple">{Math.floor((lo + hi) / 2)}</p>
      </div>
      <Button size="sm" variant="outline" className="w-full gap-1" onClick={reset}>
        <RotateCcw className="h-3 w-3" /> New Game
      </Button>
    </div>
  );

  return (
    <Layout>
      <GameLayout
        title="Binary Search Guessing"
        glowClass="neon-glow-purple"
        stats={[
          { label: "Attempts", value: attempts, color: "text-foreground" },
          { label: "Optimal", value: optimalSteps, color: "text-neon-purple" },
          ...(score !== null ? [{ label: "Score", value: `${score}/100`, color: "text-primary" }] : []),
        ]}
        explanation={{
          title: "Binary Search",
          content: "Binary search works by repeatedly dividing the search interval in half. If the target value is less than the middle element, narrow the interval to the lower half. Otherwise, narrow it to the upper half. This gives O(log n) time complexity."
        }}
        sidebarContent={sidebarContent}
      >
        <div className="mx-auto max-w-2xl space-y-8">
          {/* Range bar */}
          <div className="game-panel">
            <div className="flex justify-between text-xs text-muted-foreground font-display mb-2">
              <span>{lo}</span>
              <span className="text-neon-purple">Search Range</span>
              <span>{hi}</span>
            </div>
            <div className="h-4 w-full overflow-hidden rounded-full bg-muted relative">
              <motion.div
                className="h-full rounded-full"
                style={{
                  background: "linear-gradient(90deg, hsl(var(--neon-purple)), hsl(var(--neon-pink)))",
                  boxShadow: "0 0 12px hsl(var(--neon-purple) / 0.5)",
                }}
                animate={{
                  marginLeft: `${((lo - 1) / 999) * 100}%`,
                  width: `${((hi - lo) / 999) * 100}%`,
                }}
                transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
              />
            </div>
            <div className="mt-2 text-center text-xs text-muted-foreground">
              {hi - lo + 1} numbers remaining
            </div>
          </div>

          {/* Input */}
          {!won ? (
            <div className="flex gap-3">
              <Input
                type="number"
                min={1}
                max={1000}
                value={guess}
                onChange={(e) => setGuess(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleGuess()}
                placeholder={`Guess (${lo}–${hi})`}
                className="border-border bg-muted/30 text-foreground placeholder:text-muted-foreground text-lg h-12"
              />
              <Button variant="neonPurple" size="lg" onClick={handleGuess} className="gap-2 px-6">
                <Sparkles className="h-4 w-4" /> Guess
              </Button>
            </div>
          ) : (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="rounded-xl border border-primary bg-primary/10 p-8 text-center neon-border"
            >
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 0.5 }}
              >
                <Check className="mx-auto h-12 w-12 text-primary" />
              </motion.div>
              <p className="mt-3 font-display text-2xl font-bold text-primary">
                You got it in {attempts} attempts!
              </p>
              <p className="mt-1 text-sm text-muted-foreground">The number was {target}</p>
              <Button variant="neonGreen" className="mt-6 gap-1" onClick={reset}>
                <RotateCcw className="h-3 w-3" /> Play Again
              </Button>
            </motion.div>
          )}

          {/* History */}
          {history.length > 0 && (
            <div className="space-y-2">
              <h3 className="font-display text-xs font-bold text-muted-foreground uppercase tracking-wider">Guess Log</h3>
              {history.map((h, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.03 }}
                  className="flex items-center gap-3 rounded-lg border border-border bg-card/50 px-4 py-2.5 text-sm"
                >
                  <span className="font-display text-xs text-muted-foreground w-6">#{i + 1}</span>
                  <span className="font-bold text-foreground text-lg w-12">{h.val}</span>
                  {h.result === "low" && (
                    <span className="flex items-center gap-1.5 text-neon-orange">
                      <ArrowUp className="h-4 w-4" /> Too Low
                    </span>
                  )}
                  {h.result === "high" && (
                    <span className="flex items-center gap-1.5 text-neon-cyan">
                      <ArrowDown className="h-4 w-4" /> Too High
                    </span>
                  )}
                  {h.result === "correct" && (
                    <span className="flex items-center gap-1.5 text-primary font-bold">
                      <Check className="h-4 w-4" /> Correct!
                    </span>
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </GameLayout>
    </Layout>
  );
};

export default BinarySearchGame;
