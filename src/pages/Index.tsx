import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Zap, Search, Layers, ArrowRight, Gamepad2, Sparkles, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import Layout from "@/components/Layout";

const algorithms = [
  {
    icon: Zap,
    title: "Shortest Path",
    subtitle: "Graphs – BFS & Dijkstra",
    description:
      "Find the fastest route through a maze! BFS explores level by level like ripples in water, while Dijkstra weighs each step to find the truly optimal path.",
    cardClass: "game-card",
    glowClass: "neon-glow",
    iconColor: "text-primary",
    difficulty: 70,
    difficultyLabel: "Advanced",
    difficultyColor: "from-primary to-neon-blue",
  },
  {
    icon: Search,
    title: "Binary Search",
    subtitle: "Divide & Conquer",
    description:
      "Cut the search space in half every guess! Instead of checking every number, binary search eliminates 50% of possibilities each time.",
    cardClass: "game-card game-card-purple",
    glowClass: "neon-glow-purple",
    iconColor: "text-neon-purple",
    difficulty: 40,
    difficultyLabel: "Beginner",
    difficultyColor: "from-neon-purple to-neon-pink",
  },
  {
    icon: Layers,
    title: "Tower of Hanoi",
    subtitle: "Recursion",
    description:
      "Move a stack of disks one at a time, never placing a larger disk on a smaller one. This classic puzzle demonstrates the power of recursive thinking.",
    cardClass: "game-card game-card-cyan",
    glowClass: "neon-glow-cyan",
    iconColor: "text-neon-cyan",
    difficulty: 55,
    difficultyLabel: "Intermediate",
    difficultyColor: "from-neon-cyan to-neon-blue",
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.15, duration: 0.7, ease: [0.23, 1, 0.32, 1] },
  }),
};

const Index = () => {
  const navigate = useNavigate();

  return (
    <Layout>
      {/* Hero */}
      <section className="relative flex min-h-[90vh] flex-col items-center justify-center px-4 text-center overflow-hidden">
        {/* Decorative orbs */}
        <div className="pointer-events-none absolute top-1/4 left-1/4 h-96 w-96 rounded-full bg-primary/5 blur-[100px]" />
        <div className="pointer-events-none absolute bottom-1/4 right-1/4 h-96 w-96 rounded-full bg-neon-purple/5 blur-[100px]" />
        <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-64 w-64 rounded-full bg-neon-blue/5 blur-[80px]" />

        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.23, 1, 0.32, 1] }}
          className="relative"
        >
          <motion.div
            className="mb-6 flex items-center justify-center"
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          >
            <div className="relative">
              <Gamepad2 className="h-20 w-20 text-primary" />
              <div className="absolute inset-0 h-20 w-20 rounded-full bg-primary/20 blur-xl" />
            </div>
          </motion.div>

          <h1 className="font-display text-5xl font-black leading-tight tracking-tight sm:text-7xl lg:text-8xl">
            <span className="text-gradient-animated">DSA Game</span>
            <br />
            <span className="text-foreground">Arena</span>
          </h1>

          <motion.p
            className="mx-auto mt-6 max-w-xl text-lg text-muted-foreground"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            Learn Algorithms by Playing Games. Master data structures through
            interactive challenges, visual animations, and competitive gameplay.
          </motion.p>

          <motion.div
            className="mt-10 flex items-center justify-center gap-4"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
          >
            <Button
              variant="neonGreen"
              size="lg"
              className="gap-2 group"
              onClick={() => navigate("/dashboard")}
            >
              <Sparkles className="h-4 w-4" />
              Start Playing
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Button>
            <Button
              variant="glowOutline"
              size="lg"
              className="gap-2"
              onClick={() => document.getElementById("learn")?.scrollIntoView({ behavior: "smooth" })}
            >
              <Trophy className="h-4 w-4" />
              Learn More
            </Button>
          </motion.div>

          {/* XP style bar */}
          <motion.div
            className="mx-auto mt-12 max-w-xs"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
              <span className="font-display">LEVEL 1</span>
              <span>0 / 300 XP</span>
            </div>
            <div className="xp-bar">
              <div className="xp-bar-fill" style={{ width: "5%" }} />
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Algorithm Sections */}
      <section id="learn" className="container pb-24 space-y-16">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="font-display text-3xl font-bold sm:text-4xl">
            What You'll <span className="text-gradient-animated">Learn</span>
          </h2>
          <p className="mt-3 text-muted-foreground">Master these fundamental algorithms through play</p>
        </motion.div>

        <div className="grid gap-8 md:grid-cols-3">
          {algorithms.map((algo, i) => (
            <motion.div
              key={algo.title}
              custom={i}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className={algo.cardClass}
            >
              <div className="flex items-start justify-between">
                <motion.div
                  animate={{ rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 4, repeat: Infinity, delay: i * 0.5 }}
                >
                  <algo.icon className={`h-10 w-10 ${algo.iconColor}`} />
                </motion.div>
                <span className="rounded-full border border-border bg-muted/50 px-2.5 py-0.5 text-[10px] font-display font-medium text-muted-foreground">
                  {algo.difficultyLabel}
                </span>
              </div>
              <h3 className={`mt-4 font-display text-xl font-bold ${algo.glowClass}`}>
                {algo.title}
              </h3>
              <p className="mt-1 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                {algo.subtitle}
              </p>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                {algo.description}
              </p>
              {/* Difficulty bar */}
              <div className="mt-5">
                <div className="flex justify-between text-[10px] text-muted-foreground mb-1">
                  <span>Difficulty</span>
                  <span>{algo.difficulty}%</span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-muted">
                  <motion.div
                    className={`h-full rounded-full bg-gradient-to-r ${algo.difficultyColor}`}
                    initial={{ width: 0 }}
                    whileInView={{ width: `${algo.difficulty}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: 0.3 + i * 0.15 }}
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          className="text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <Button
            variant="neonGreen"
            size="lg"
            className="gap-2 group"
            onClick={() => navigate("/dashboard")}
          >
            Go to Dashboard
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Button>
        </motion.div>
      </section>
    </Layout>
  );
};

export default Index;
