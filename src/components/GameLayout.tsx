import { ReactNode, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Info } from "lucide-react";

interface GameLayoutProps {
  children: ReactNode;
  title: string;
  glowClass?: string;
  stats?: { label: string; value: string | number; color?: string }[];
  explanation?: { title: string; content: string };
  sidebarContent?: ReactNode;
}

const GameLayout = ({
  children,
  title,
  glowClass = "neon-glow",
  stats = [],
  explanation,
  sidebarContent,
}: GameLayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);

  return (
    <div className="flex min-h-[calc(100vh-4rem)]">
      {/* Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.aside
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 280, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="shrink-0 overflow-hidden border-r border-border bg-card/50 backdrop-blur-sm"
          >
            <div className="p-4 space-y-4">
              <h3 className="font-display text-sm font-bold text-foreground">Controls</h3>
              {sidebarContent}
              {explanation && (
                <div className="space-y-2">
                  <button
                    onClick={() => setShowExplanation(!showExplanation)}
                    className="flex items-center gap-2 text-xs text-muted-foreground hover:text-primary transition-colors"
                  >
                    <Info className="h-3 w-3" />
                    {showExplanation ? "Hide" : "Show"} Algorithm Explanation
                  </button>
                  <AnimatePresence>
                    {showExplanation && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden rounded-lg border border-border bg-muted/30 p-3"
                      >
                        <h4 className="font-display text-xs font-bold text-primary mb-1">{explanation.title}</h4>
                        <p className="text-xs text-muted-foreground leading-relaxed">{explanation.content}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main area */}
      <div className="flex-1 flex flex-col">
        {/* Top bar */}
        <div className="border-b border-border bg-card/30 backdrop-blur-sm px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-all"
            >
              {sidebarOpen ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
            </button>
            <h1 className={`font-display text-lg font-bold ${glowClass}`}>{title}</h1>
          </div>
          <div className="flex items-center gap-3">
            {stats.map((stat) => (
              <div key={stat.label} className="stat-badge">
                <span className="text-muted-foreground">{stat.label}:</span>
                <span className={`font-bold ${stat.color || "text-foreground"}`}>{stat.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Game content */}
        <div className="flex-1 p-6">
          {children}
        </div>
      </div>
    </div>
  );
};

export default GameLayout;
