import { Link, useLocation } from "react-router-dom";
import { Gamepad2, Volume2, VolumeX } from "lucide-react";
import { useState } from "react";

const Navbar = () => {
  const location = useLocation();
  const [soundOn, setSoundOn] = useState(false);

  const links = [
    { to: "/", label: "Home" },
    { to: "/dashboard", label: "Games" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/60 backdrop-blur-xl">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="relative">
            <Gamepad2 className="h-7 w-7 text-primary transition-all duration-300 group-hover:drop-shadow-[0_0_8px_hsl(var(--primary)/0.8)]" />
          </div>
          <span className="font-display text-lg font-bold text-gradient-animated">DSA Game Arena</span>
        </Link>
        <div className="flex items-center gap-8">
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`relative text-sm font-medium transition-all duration-300 hover:text-primary ${
                location.pathname === link.to
                  ? "nav-link-active"
                  : "text-muted-foreground"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <button
            onClick={() => setSoundOn(!soundOn)}
            className="rounded-lg p-2 text-muted-foreground transition-all duration-300 hover:bg-muted hover:text-primary"
          >
            {soundOn ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
