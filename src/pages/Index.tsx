import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Zap, Search, Layers, ArrowRight, Gamepad2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Layout from "@/components/Layout";

const algorithms = [
  {
    icon: Zap,
    title: "Shortest Path",
    subtitle: "Graphs – BFS & Dijkstra",
    description:
      "Find the fastest route through a maze! BFS explores level by level like ripples in water, while Dijkstra weighs each step to find the truly optimal path.",
    color: "primary",
    glowClass: "neon-glow",
    borderClass: "neon-border",
  },
  {
    icon: Search,
    title: "Binary Search",
    subtitle: "Divide & Conquer",
    description:
      "Cut the search space in half every guess! Instead of checking every number, binary search eliminates 50% of possibilities each time — finding answers in logarithmic time.",
    color: "neon-purple",
    glowClass: "neon-glow-purple",
    borderClass: "neon-border-purple",
  },
  {
    icon: Layers,
    title: "Tower of Hanoi",
    subtitle: "Recursion",
    description:
      "Move a stack of disks one at a time, never placing a larger disk on a smaller one. This classic puzzle elegantly demonstrates the power of recursive thinking.",
    color: "neon-cyan",
    glowClass: "neon-glow-cyan",
    borderClass: "neon-border-cyan",
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.15, duration: 0.6, ease: "easeOut" },
  }),
};

const Index = () => {
  const navigate = useNavigate();

  return (
    <Layout>
      {/* Hero */}
      <section className="relative flex min-h-[85vh] flex-col items-center justify-center px-4 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div className="mb-6 flex items-center justify-center">
            <Gamepad2 className="h-16 w-16 text-primary animate-float" />
          </div>
          <h1 className="font-display text-5xl font-black leading-tight tracking-tight sm:text-7xl neon-glow">
            <span className="text-gradient-primary">DSA Game</span>{" "}
            <span className="text-foreground">Arena</span>
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-lg text-muted-foreground">
            Learn Algorithms by Playing Games. Master data structures through
            interactive challenges, visual animations, and competitive gameplay.
          </p>
          <Button
            size="lg"
            className="mt-10 gap-2 bg-primary font-display text-sm font-semibold text-primary-foreground hover:bg-primary/90 neon-border"
            onClick={() => navigate("/dashboard")}
          >
            Start Playing <ArrowRight className="h-4 w-4" />
          </Button>
        </motion.div>

        {/* Decorative orbs */}
        <div className="pointer-events-none absolute -top-20 left-1/4 h-72 w-72 rounded-full bg-primary/5 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 right-1/4 h-72 w-72 rounded-full bg-neon-purple/5 blur-3xl" />
      </section>

      {/* Algorithm Sections */}
      <section className="container pb-24 space-y-16">
        <motion.h2
          className="text-center font-display text-3xl font-bold text-foreground"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          What You'll <span className="text-gradient-primary">Learn</span>
        </motion.h2>

        <div className="grid gap-8 md:grid-cols-3">
          {algorithms.map((algo, i) => (
            <motion.div
              key={algo.title}
              custom={i}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className={`game-card ${algo.borderClass}`}
            >
              <algo.icon className={`mb-4 h-10 w-10 text-${algo.color}`} />
              <h3 className={`font-display text-xl font-bold ${algo.glowClass}`}>
                {algo.title}
              </h3>
              <p className="mt-1 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                {algo.subtitle}
              </p>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                {algo.description}
              </p>
            </motion.div>
          ))}
        </div>

        <div className="text-center">
          <Button
            size="lg"
            className="gap-2 bg-primary font-display text-sm font-semibold text-primary-foreground hover:bg-primary/90 neon-border"
            onClick={() => navigate("/dashboard")}
          >
            Go to Dashboard <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
