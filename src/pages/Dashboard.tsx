import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Zap, Search, Layers, Play, Trophy, Star, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import Layout from "@/components/Layout";

const games = [
  {
    title: "Shortest Path Battle",
    description: "Build a maze, pick start & end points, then watch BFS race to find the optimal path with real-time visualization.",
    icon: Zap,
    route: "/game/shortest-path",
    cardClass: "game-card",
    iconColor: "text-primary",
    buttonVariant: "neonGreen" as const,
    difficulty: "Advanced",
    xp: 150,
    gradient: "from-primary/20 to-neon-blue/20",
  },
  {
    title: "Binary Search Guessing",
    description: "Guess a hidden number between 1–1000. Compare your strategy against optimal binary search and earn points.",
    icon: Search,
    route: "/game/binary-search",
    cardClass: "game-card game-card-purple",
    iconColor: "text-neon-purple",
    buttonVariant: "neonPurple" as const,
    difficulty: "Beginner",
    xp: 100,
    gradient: "from-neon-purple/20 to-neon-pink/20",
  },
  {
    title: "Tower of Hanoi",
    description: "Move all disks following the rules. Watch the recursive auto-solve or challenge yourself for minimum moves.",
    icon: Layers,
    route: "/game/tower-of-hanoi",
    cardClass: "game-card game-card-cyan",
    iconColor: "text-neon-cyan",
    buttonVariant: "neonCyan" as const,
    difficulty: "Intermediate",
    xp: 120,
    gradient: "from-neon-cyan/20 to-neon-blue/20",
  },
];

const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <Layout>
      <section className="container py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-6 text-center"
        >
          <h1 className="font-display text-4xl font-bold text-gradient-animated">Choose Your Game</h1>
          <p className="mt-3 text-muted-foreground">Select a challenge and start earning XP</p>
        </motion.div>

        {/* Player stats bar */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mx-auto mb-12 max-w-md rounded-xl border border-border bg-card/50 backdrop-blur-sm p-4"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Trophy className="h-4 w-4 text-neon-orange" />
              <span className="font-display text-xs font-bold text-foreground">Player Stats</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                <Star className="h-3 w-3 text-neon-orange" />
                <span className="text-xs text-muted-foreground">Level 1</span>
              </div>
              <div className="flex items-center gap-1">
                <Target className="h-3 w-3 text-primary" />
                <span className="text-xs text-muted-foreground">0 XP</span>
              </div>
            </div>
          </div>
          <div className="xp-bar">
            <div className="xp-bar-fill" style={{ width: "5%" }} />
          </div>
        </motion.div>

        <div className="mx-auto grid max-w-5xl gap-8 md:grid-cols-3">
          {games.map((game, i) => (
            <motion.div
              key={game.title}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.12, duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
              className={`${game.cardClass} flex flex-col`}
            >
              {/* Top gradient strip */}
              <div className={`-mx-6 -mt-6 mb-5 h-1 bg-gradient-to-r ${game.gradient}`} />

              <div className="flex items-start justify-between">
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 5, repeat: Infinity, delay: i * 0.7 }}
                >
                  <game.icon className={`h-10 w-10 ${game.iconColor}`} />
                </motion.div>
                <div className="flex flex-col items-end gap-1">
                  <span className="rounded-full border border-border bg-muted/50 px-2 py-0.5 text-[10px] font-display text-muted-foreground">
                    {game.difficulty}
                  </span>
                  <span className="text-[10px] text-neon-orange font-display">+{game.xp} XP</span>
                </div>
              </div>

              <h3 className="mt-3 font-display text-lg font-bold text-foreground">{game.title}</h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">{game.description}</p>

              <Button
                variant={game.buttonVariant}
                className="mt-6 w-full gap-2 group"
                onClick={() => navigate(game.route)}
              >
                <Play className="h-3 w-3 transition-transform duration-300 group-hover:scale-110" />
                Play Now
              </Button>
            </motion.div>
          ))}
        </div>
      </section>
    </Layout>
  );
};

export default Dashboard;
