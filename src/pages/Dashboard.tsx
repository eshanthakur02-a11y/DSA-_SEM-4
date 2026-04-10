import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Zap, Search, Layers, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import Layout from "@/components/Layout";

const games = [
  {
    title: "Shortest Path Battle",
    description: "Build a maze, pick start & end points, then watch BFS and Dijkstra race to find the optimal path. Visualize visited nodes in real-time.",
    icon: Zap,
    route: "/game/shortest-path",
    borderClass: "neon-border",
    colorClass: "text-primary",
  },
  {
    title: "Binary Search Guessing",
    description: "Guess a hidden number between 1 and 1000. Get feedback on each guess and compare your strategy against the optimal binary search approach.",
    icon: Search,
    route: "/game/binary-search",
    borderClass: "neon-border-purple",
    colorClass: "text-neon-purple",
  },
  {
    title: "Tower of Hanoi",
    description: "Move all disks from one rod to another following the rules. Challenge yourself or watch the recursive auto-solve animation.",
    icon: Layers,
    route: "/game/tower-of-hanoi",
    borderClass: "neon-border-cyan",
    colorClass: "text-neon-cyan",
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
          className="mb-12 text-center"
        >
          <h1 className="font-display text-4xl font-bold neon-glow">Choose Your Game</h1>
          <p className="mt-3 text-muted-foreground">Select a challenge and start learning</p>
        </motion.div>

        <div className="mx-auto grid max-w-4xl gap-8 md:grid-cols-3">
          {games.map((game, i) => (
            <motion.div
              key={game.title}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className={`game-card flex flex-col ${game.borderClass}`}
            >
              <game.icon className={`mb-4 h-10 w-10 ${game.colorClass}`} />
              <h3 className="font-display text-lg font-bold text-foreground">{game.title}</h3>
              <p className="mt-2 flex-1 text-sm text-muted-foreground">{game.description}</p>
              <Button
                className="mt-6 w-full gap-2 bg-primary font-display text-xs font-semibold text-primary-foreground hover:bg-primary/90"
                onClick={() => navigate(game.route)}
              >
                <Play className="h-3 w-3" /> Play
              </Button>
            </motion.div>
          ))}
        </div>
      </section>
    </Layout>
  );
};

export default Dashboard;
