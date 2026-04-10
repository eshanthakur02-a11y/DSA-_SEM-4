import { ReactNode } from "react";
import Navbar from "./Navbar";
import ParticleBackground from "./ParticleBackground";

const Layout = ({ children }: { children: ReactNode }) => (
  <div className="min-h-screen animated-bg grid-bg relative">
    <ParticleBackground />
    <Navbar />
    <main className="relative z-10 pt-16">{children}</main>
  </div>
);

export default Layout;
