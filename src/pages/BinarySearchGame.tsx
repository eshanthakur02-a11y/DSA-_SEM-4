import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Layout from "@/components/Layout";
import { RotateCcw, ArrowUp, ArrowDown, Check } from "lucide-react";

const BinarySearchGame = () => {
  const [target, setTarget] = useState(() => Math.floor(Math.random() * 1000) + 1);
  const [guess, setGuess] = useState("");
  const [lo, setLo] = useState(1);
  const [hi, setHi] = useState(1000);
  const [attempts, setAttempts] = useState(0);
  const [history, setHistory] = useState<{ val: number; result: string }[]>([]);
  const [won, setWon] = useState(false);

  const optimalSteps = Math.ceil(Math.log2(1000)); // 10

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

  return (
    <Layout>
      <section className="container max-w-2xl py-20">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-10 text-center">
          <h1 className="font-display text-3xl font-bold neon-glow-purple">Binary Search Guessing</h1>
          <p className="mt-2 text-sm text-muted-foreground">Guess the number between 1 and 1000</p>
        </motion.div>

        {/* Range bar */}
        <div className="mb-8">
          <div className="flex justify-between text-xs text-muted-foreground font-display">
            <span>{lo}</span>
            <span>Search Range</span>
            <span>{hi}</span>
          </div>
          <div className="mt-1 h-3 w-full overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-neon-purple transition-all duration-300"
              style={{
                marginLeft: `${((lo - 1) / 999) * 100}%`,
                width: `${((hi - lo) / 999) * 100}%`,
              }}
            />
          </div>
        </div>

        {/* Stats */}
        <div className="mb-6 flex justify-center gap-8 text-sm">
          <span className="text-muted-foreground">Attempts: <strong className="text-foreground">{attempts}</strong></span>
          <span className="text-muted-foreground">Optimal: <strong className="text-neon-purple">{optimalSteps}</strong></span>
          {score !== null && (
            <span className="text-muted-foreground">Score: <strong className="text-primary">{score}/100</strong></span>
          )}
        </div>

        {/* Input */}
        {!won ? (
          <div className="flex gap-2">
            <Input
              type="number"
              min={1}
              max={1000}
              value={guess}
              onChange={(e) => setGuess(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleGuess()}
              placeholder={`Guess (${lo}–${hi})`}
              className="border-border bg-muted/50 text-foreground placeholder:text-muted-foreground"
            />
            <Button className="bg-neon-purple font-display text-xs text-secondary-foreground hover:bg-neon-purple/80" onClick={handleGuess}>
              Guess
            </Button>
          </div>
        ) : (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="rounded-xl border border-primary bg-primary/10 p-6 text-center neon-border"
          >
            <Check className="mx-auto h-10 w-10 text-primary" />
            <p className="mt-2 font-display text-xl font-bold text-primary">
              You got it in {attempts} attempts!
            </p>
            <Button className="mt-4 bg-primary font-display text-xs text-primary-foreground hover:bg-primary/90" onClick={reset}>
              <RotateCcw className="mr-1 h-3 w-3" /> Play Again
            </Button>
          </motion.div>
        )}

        {/* History */}
        {history.length > 0 && (
          <div className="mt-8 space-y-2">
            {history.map((h, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-3 rounded-lg border border-border bg-card px-4 py-2 text-sm"
              >
                <span className="font-display text-foreground">#{i + 1}</span>
                <span className="font-bold text-foreground">{h.val}</span>
                {h.result === "low" && (
                  <span className="flex items-center gap-1 text-neon-orange">
                    <ArrowUp className="h-3 w-3" /> Too Low
                  </span>
                )}
                {h.result === "high" && (
                  <span className="flex items-center gap-1 text-neon-cyan">
                    <ArrowDown className="h-3 w-3" /> Too High
                  </span>
                )}
                {h.result === "correct" && (
                  <span className="flex items-center gap-1 text-primary">
                    <Check className="h-3 w-3" /> Correct!
                  </span>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </section>
    </Layout>
  );
};

export default BinarySearchGame;
