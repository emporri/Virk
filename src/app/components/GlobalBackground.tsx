import { useEffect, useRef } from "react";
import { motion } from "motion/react";

/* Floating particles drawn on canvas */
function ParticleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let w = window.innerWidth;
    let h = window.innerHeight;

    canvas.width = w;
    canvas.height = h;

    const PARTICLE_COUNT = 55;

    interface Particle {
      x: number; y: number; vx: number; vy: number;
      r: number; alpha: number; alphaDir: number;
      color: string;
    }

    const COLORS = [
      "rgba(249,115,22,",  // orange
      "rgba(234,88,12,",   // deep orange
      "rgba(251,146,60,",  // light orange
      "rgba(253,186,116,", // amber-orange
      "rgba(220,75,10,",   // rich orange
    ];

    const particles: Particle[] = Array.from({ length: PARTICLE_COUNT }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      r: Math.random() * 1.8 + 0.4,
      alpha: Math.random() * 0.4 + 0.05,
      alphaDir: Math.random() > 0.5 ? 1 : -1,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
    }));

    const draw = () => {
      ctx.clearRect(0, 0, w, h);

      particles.forEach((p, i) => {
        // Drift
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < -10) p.x = w + 10;
        if (p.x > w + 10) p.x = -10;
        if (p.y < -10) p.y = h + 10;
        if (p.y > h + 10) p.y = -10;

        // Pulse alpha
        p.alpha += p.alphaDir * 0.003;
        if (p.alpha > 0.55 || p.alpha < 0.04) p.alphaDir *= -1;

        // Draw glow dot
        const grd = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 6);
        grd.addColorStop(0, `${p.color}${p.alpha})`);
        grd.addColorStop(1, `${p.color}0)`);
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r * 6, 0, Math.PI * 2);
        ctx.fillStyle = grd;
        ctx.fill();

        // Draw connections
        for (let j = i + 1; j < particles.length; j++) {
          const q = particles[j];
          const dx = p.x - q.x;
          const dy = p.y - q.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 130) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(q.x, q.y);
            const lineAlpha = (1 - dist / 130) * 0.12;
            ctx.strokeStyle = `rgba(249,115,22,${lineAlpha})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      });

      animId = requestAnimationFrame(draw);
    };

    draw();

    const onResize = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w;
      canvas.height = h;
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ opacity: 0.7 }}
    />
  );
}

export function GlobalBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Base gradient */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 120% 80% at 15% 10%, rgba(249,115,22,0.07) 0%, transparent 55%), " +
            "radial-gradient(ellipse 80% 60% at 85% 80%, rgba(234,88,12,0.06) 0%, transparent 50%), " +
            "linear-gradient(160deg, #080500 0%, #0e0700 40%, #080300 100%)",
        }}
      />

      {/* Large ambient orb — top-right */}
      <motion.div
        className="absolute rounded-full blur-3xl"
        style={{
          width: 700,
          height: 700,
          background: "radial-gradient(circle, rgba(249,115,22,0.09) 0%, transparent 70%)",
          top: "-15%",
          right: "-10%",
        }}
        animate={{ scale: [1, 1.15, 1], x: [0, 30, 0], y: [0, -20, 0] }}
        transition={{ repeat: Infinity, duration: 18, ease: "easeInOut" }}
      />

      {/* Large ambient orb — bottom-left */}
      <motion.div
        className="absolute rounded-full blur-3xl"
        style={{
          width: 600,
          height: 600,
          background: "radial-gradient(circle, rgba(234,88,12,0.07) 0%, transparent 70%)",
          bottom: "-10%",
          left: "-8%",
        }}
        animate={{ scale: [1, 1.2, 1], x: [0, -20, 0], y: [0, 25, 0] }}
        transition={{ repeat: Infinity, duration: 22, ease: "easeInOut", delay: 4 }}
      />

      {/* Mid accent orb */}
      <motion.div
        className="absolute rounded-full blur-2xl"
        style={{
          width: 300,
          height: 300,
          background: "radial-gradient(circle, rgba(251,146,60,0.08) 0%, transparent 70%)",
          top: "40%",
          left: "50%",
        }}
        animate={{ x: [-40, 40, -40], y: [-20, 30, -20] }}
        transition={{ repeat: Infinity, duration: 14, ease: "easeInOut", delay: 2 }}
      />

      {/* Subtle grid lines */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(rgba(249,115,22,0.03) 1px, transparent 1px), " +
            "linear-gradient(90deg, rgba(249,115,22,0.03) 1px, transparent 1px)",
          backgroundSize: "80px 80px",
        }}
      />

      {/* Particle canvas */}
      <ParticleCanvas />
    </div>
  );
}
