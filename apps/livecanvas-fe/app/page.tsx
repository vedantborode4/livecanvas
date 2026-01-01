"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";

export default function Home() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouse = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = canvas.width = canvas.offsetWidth;
    let height = canvas.height = canvas.offsetHeight;

    type Dot = { x: number; y: number; vx: number; vy: number };
    const dots: Dot[] = [];
    const DOT_COUNT = 40;

    for (let i = 0; i < DOT_COUNT; i++) {
      dots.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
      });
    }

    const animate = () => {
      if (!ctx) return;
      ctx.clearRect(0, 0, width, height);

      dots.forEach(dot => {
        // Move dots
        dot.x += dot.vx;
        dot.y += dot.vy;

        // Bounce off edges
        if (dot.x < 0 || dot.x > width) dot.vx *= -1;
        if (dot.y < 0 || dot.y > height) dot.vy *= -1;

        // Attract to mouse
        const dx = mouse.current.x - dot.x;
        const dy = mouse.current.y - dot.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 100) {
          dot.vx += dx * 0.0005;
          dot.vy += dy * 0.0005;
        }
      });

      // Draw lines between nearby dots
      for (let i = 0; i < dots.length; i++) {
        for (let j = i + 1; j < dots.length; j++) {
          const dx = dots[i].x - dots[j].x;
          const dy = dots[i].y - dots[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.strokeStyle = `rgba(99,102,241,${1 - dist / 120})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(dots[i].x, dots[i].y);
            ctx.lineTo(dots[j].x, dots[j].y);
            ctx.stroke();
          }
        }
      }

      // Draw dots
      dots.forEach(dot => {
        ctx.fillStyle = "#6366F1";
        ctx.beginPath();
        ctx.arc(dot.x, dot.y, 3, 0, Math.PI * 2);
        ctx.fill();
      });

      requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.current.x = e.clientX - rect.left;
      mouse.current.y = e.clientY - rect.top;
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <main className="min-h-screen flex flex-col overflow-hidden">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-neutral-800 fixed w-full z-20 backdrop-blur-sm bg-neutral-950/80">
        <div className="text-2xl font-bold tracking-tight">
          Live<span className="text-indigo-400">Canvas</span>
        </div>

        <nav className="hidden md:flex items-center gap-4 text-sm text-neutral-300">
          <Link
            href="/signin"
            className="px-3 py-1 rounded-md hover:bg-neutral-800 transition"
          >
            Sign In
          </Link>
          <Link
            href="/canvas"
            className="px-4 py-2 rounded-md bg-indigo-500 text-white hover:bg-indigo-400 transition"
          >
            Start Drawing
          </Link>
        </nav>
      </header>

      {/* Hero */}
      <section className="relative flex flex-col items-center justify-center text-center px-6 pt-32 pb-40">
        {/* Canvas animation */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full -z-10"
        />

        <h1 className="text-4xl md:text-6xl font-bold leading-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-500">
          Your <span className="text-indigo-400">infinite canvas</span>
          <br className="hidden md:block" /> to think and create
        </h1>

        <p className="mt-6 max-w-xl text-neutral-400 text-base md:text-lg">
          LiveCanvas is a real-time, multiplayer drawing canvas for ideas —
          fast, distraction-free, and collaborative.
        </p>

        <div className="mt-10 flex gap-4">
          <Link
            href="/canvas"
            className="px-6 py-3 rounded-lg bg-indigo-500 text-white font-medium hover:bg-indigo-400 transition-transform hover:scale-105"
          >
            Start Drawing
          </Link>
          <Link
            href="/signin"
            className="px-6 py-3 rounded-lg border border-neutral-700 text-neutral-300 hover:border-neutral-500 hover:text-white transition-transform hover:scale-105"
          >
            Sign In
          </Link>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="px-6 py-24 border-t border-neutral-800">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">
          {[
            {
              title: "Realtime Collaboration",
              desc: "Draw together instantly with shared cursors and live updates.",
            },
            {
              title: "Infinite Canvas",
              desc: "Zoom, pan, and explore freely without limits.",
            },
            {
              title: "Minimal & Fast",
              desc: "Tools stay out of your way. Just create.",
            },
          ].map((feature) => (
            <div
              key={feature.title}
              className="p-6 rounded-xl bg-neutral-900 border border-neutral-800 hover:border-neutral-700 transform hover:-translate-y-2 hover:scale-105 transition-all duration-300 cursor-pointer"
            >
              <h3 className="text-lg font-semibold mb-2 text-indigo-400">{feature.title}</h3>
              <p className="text-sm text-neutral-400">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto px-6 py-6 border-t border-neutral-800 text-sm text-neutral-500 flex justify-between">
        <span>© {new Date().getFullYear()} LiveCanvas</span>
        <span>Built with Next.js + Tailwind</span>
      </footer>
    </main>
  );
}
