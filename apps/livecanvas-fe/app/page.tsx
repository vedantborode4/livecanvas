"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";

export default function Home() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouse = useRef({ x: -1000, y: -1000 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = (canvas.width = canvas.offsetWidth);
    let h = (canvas.height = canvas.offsetHeight);
    let raf: number;

    type Node = { x: number; y: number; vx: number; vy: number };
    const nodes: Node[] = [];
    const COUNT = 50;

    for (let i = 0; i < COUNT; i++) {
      nodes.push({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
      });
    }

    function draw() {
      if (!ctx) return;
      ctx.clearRect(0, 0, w, h);

      nodes.forEach((n) => {
        n.x += n.vx;
        n.y += n.vy;
        if (n.x < 0 || n.x > w) n.vx *= -1;
        if (n.y < 0 || n.y > h) n.vy *= -1;

        const dx = mouse.current.x - n.x;
        const dy = mouse.current.y - n.y;
        const d = Math.sqrt(dx * dx + dy * dy);
        if (d < 140) {
          n.vx += dx * 0.0003;
          n.vy += dy * 0.0003;
        }
      });

      // Lines
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < 110) {
            ctx.strokeStyle = `rgba(137,180,250,${(1 - d / 110) * 0.35})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.stroke();
          }
        }
      }

      // Dots
      nodes.forEach((n) => {
        const md = Math.sqrt((mouse.current.x - n.x) ** 2 + (mouse.current.y - n.y) ** 2);
        const glow = Math.max(0, 1 - md / 200);
        ctx.fillStyle = `rgba(137,180,250,${0.3 + glow * 0.5})`;
        ctx.beginPath();
        ctx.arc(n.x, n.y, 2 + glow * 2, 0, Math.PI * 2);
        ctx.fill();
      });

      raf = requestAnimationFrame(draw);
    }

    draw();

    const onResize = () => {
      w = canvas.width = canvas.offsetWidth;
      h = canvas.height = canvas.offsetHeight;
    };
    const onMouse = (e: MouseEvent) => {
      const r = canvas.getBoundingClientRect();
      mouse.current.x = e.clientX - r.left;
      mouse.current.y = e.clientY - r.top;
    };

    window.addEventListener("resize", onResize);
    window.addEventListener("mousemove", onMouse);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("mousemove", onMouse);
    };
  }, []);

  const features = [
    {
      title: "Realtime Collaboration",
      desc: "Draw together with shared cursors and live shape sync. Every stroke appears instantly for everyone.",
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#89b4fa" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      ),
    },
    {
      title: "Infinite Canvas",
      desc: "Pan, zoom, and explore without boundaries. Your canvas grows with your ideas.",
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#89b4fa" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="15 3 21 3 21 9" /><polyline points="9 21 3 21 3 15" /><line x1="21" y1="3" x2="14" y2="10" /><line x1="3" y1="21" x2="10" y2="14" />
        </svg>
      ),
    },
    {
      title: "Every Shape You Need",
      desc: "Rectangles, circles, ellipses, triangles, diamonds, arrows, freehand drawing, and text — all built in.",
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#89b4fa" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5" />
        </svg>
      ),
    },
    {
      title: "Minimal & Blazing Fast",
      desc: "No bloat, no distractions. A canvas that stays out of your way and lets you create at the speed of thought.",
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#89b4fa" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="13 2 3 14 12 14 11 22 21 10 12 10" />
        </svg>
      ),
    },
  ];

  return (
    <main className="min-h-screen flex flex-col overflow-hidden bg-[#1e1e2e] text-[#cdd6f4]">
      {/* Header */}
      <header className="fixed w-full z-30 top-0">
        <div className="mx-auto flex items-center justify-between px-6 py-4 backdrop-blur-xl bg-[#1e1e2e]/80 border-b border-[#313244]/40">
          <div className="text-xl font-bold tracking-tight">
            Live<span className="text-[#89b4fa]">Canvas</span>
          </div>
          <nav className="flex items-center gap-2 text-sm">
            <Link
              href="/signin"
              className="px-4 py-2 rounded-lg text-[#a6adc8] hover:text-[#cdd6f4] hover:bg-[#313244]/40 transition-all"
            >
              Sign In
            </Link>
            <Link
              href="/signup"
              className="px-4 py-2 rounded-lg bg-[#89b4fa] text-[#1e1e2e] font-medium hover:bg-[#b4d0fb] transition-all"
            >
              Get Started
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="relative flex flex-col items-center justify-center text-center px-6 pt-36 pb-32 min-h-[85vh]">
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full -z-1 opacity-60" />
        <div className="absolute inset-0 bg-linear-to-b from-[#1e1e2e] via-transparent to-[#1e1e2e] pointer-events-none" />

        <div className="relative z-10 max-w-3xl">
          <div className="inline-block mb-6 px-3 py-1 rounded-full border border-[#313244] text-xs text-[#89b4fa] bg-[#89b4fa]/5">
            Open-source &middot; Collaborative &middot; Real-time
          </div>

          <h1 className="text-5xl md:text-7xl font-bold leading-[1.1] tracking-tight">
            Your infinite canvas
            <br />
            <span className="text-[#89b4fa]">to think & create</span>
          </h1>

          <p className="mt-6 text-lg md:text-xl text-[#a6adc8] leading-relaxed max-w-xl mx-auto">
            A real-time multiplayer drawing board for brainstorming,
            diagramming, and sketching ideas together — fast, minimal, and distraction-free.
          </p>

          <div className="mt-10 flex flex-wrap gap-3 justify-center">
            <Link
              href="/signup"
              className="px-7 py-3.5 rounded-xl bg-[#89b4fa] text-[#1e1e2e] font-semibold text-base hover:bg-[#b4d0fb] hover:scale-[1.02] transition-all shadow-lg shadow-[#89b4fa]/20"
            >
              Start Drawing
            </Link>
            <Link
              href="/signin"
              className="px-7 py-3.5 rounded-xl border border-[#313244] text-[#a6adc8] font-medium text-base hover:border-[#585b70] hover:text-[#cdd6f4] hover:scale-[1.02] transition-all"
            >
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="px-6 py-24 relative">
        <div className="absolute inset-0 bg-linear-to-b from-transparent via-[#181825]/50 to-transparent pointer-events-none" />
        <div className="max-w-5xl mx-auto relative">
          <h2 className="text-center text-sm font-medium tracking-widest uppercase text-[#89b4fa] mb-12">
            Built for speed and simplicity
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {features.map((f) => (
              <div
                key={f.title}
                className="group p-6 rounded-2xl bg-[#181825]/60 border border-[#313244]/40 hover:border-[#89b4fa]/20 transition-all duration-300 hover:bg-[#181825]/80"
              >
                <div className="mb-4 w-12 h-12 rounded-xl bg-[#89b4fa]/10 flex items-center justify-center group-hover:bg-[#89b4fa]/15 transition-colors">
                  {f.icon}
                </div>
                <h3 className="text-lg font-semibold text-[#cdd6f4] mb-2">
                  {f.title}
                </h3>
                <p className="text-sm text-[#6c7086] leading-relaxed">
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-20">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to collaborate?
          </h2>
          <p className="text-[#6c7086] mb-8">
            Create a room and start drawing with your team in seconds.
          </p>
          <Link
            href="/signup"
            className="inline-block px-8 py-4 rounded-xl bg-[#89b4fa] text-[#1e1e2e] font-semibold text-lg hover:bg-[#b4d0fb] transition-all shadow-lg shadow-[#89b4fa]/20 hover:scale-[1.02]"
          >
            Get Started Free
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto px-6 py-6 border-t border-[#313244]/30 flex items-center justify-between text-xs text-[#45475a]">
        <span>&copy; {new Date().getFullYear()} LiveCanvas</span>
        <span>Built with Next.js + Canvas API</span>
      </footer>
    </main>
  );
}
