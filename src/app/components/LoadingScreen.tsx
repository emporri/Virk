import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";

interface LoadingScreenProps {
  onComplete: () => void;
}

export function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState<"loading" | "hello" | "welcome" | "done">("loading");

  useEffect(() => {
    let raf: number;
    let startTime: number | null = null;
    const totalDuration = 2800;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const t = Math.min(elapsed / totalDuration, 1);

      let p: number;
      if (t < 0.6) {
        p = (t / 0.6) * 0.78;
      } else {
        const t2 = (t - 0.6) / 0.4;
        p = 0.78 + t2 * t2 * 0.22;
      }

      setProgress(Math.round(p * 100));

      if (t < 1) {
        raf = requestAnimationFrame(animate);
      } else {
        setProgress(100);
        setTimeout(() => {
          setPhase("hello");
          setTimeout(() => {
            setPhase("welcome");
            setTimeout(() => {
              setPhase("done");
              setTimeout(onComplete, 700);
            }, 1800);
          }, 1200);
        }, 300);
      }
    };

    raf = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {phase !== "done" && (
        <motion.div
          key="loading"
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center"
          style={{ background: "linear-gradient(135deg, #060300 0%, #100700 50%, #060200 100%)" }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7 }}
        >
          {/* Ambient glow orbs */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <motion.div
              className="absolute rounded-full blur-3xl opacity-20"
              style={{
                width: 600,
                height: 600,
                background: "radial-gradient(circle, #f97316, transparent)",
                top: "10%",
                left: "5%",
              }}
              animate={{ scale: [1, 1.1, 1], opacity: [0.15, 0.25, 0.15] }}
              transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
            />
            <motion.div
              className="absolute rounded-full blur-3xl opacity-15"
              style={{
                width: 500,
                height: 500,
                background: "radial-gradient(circle, #ea580c, transparent)",
                bottom: "10%",
                right: "5%",
              }}
              animate={{ scale: [1, 1.12, 1], opacity: [0.1, 0.2, 0.1] }}
              transition={{ repeat: Infinity, duration: 8, ease: "easeInOut", delay: 2 }}
            />
          </div>

          <AnimatePresence mode="wait">
            {phase === "loading" && (
              <motion.div
                key="logo-loader"
                className="flex flex-col items-center gap-10"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
              >
                {/* 3D Rotating Logo */}
                <div className="relative" style={{ perspective: 800 }}>
                  <motion.div
                    className="relative"
                    animate={{ rotateY: [0, 360] }}
                    transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
                    style={{ transformStyle: "preserve-3d" }}
                  >
                    <div
                      className="flex items-center justify-center rounded-2xl"
                      style={{
                        width: 120,
                        height: 120,
                        background: "linear-gradient(135deg, #f97316, #c2410c)",
                        boxShadow: "0 0 60px rgba(249,115,22,0.7), 0 0 120px rgba(234,88,12,0.3)",
                      }}
                    >
                      <span
                        className="text-white font-black select-none"
                        style={{ fontFamily: "Orbitron, monospace", fontSize: 42, letterSpacing: -2 }}
                      >
                        V
                      </span>
                    </div>
                  </motion.div>
                </div>

                {/* Brand name */}
                <div className="text-center">
                  <p
                    className="text-white/60 tracking-[0.4em] uppercase text-xs mb-1"
                    style={{ fontFamily: "Space Grotesk, sans-serif" }}
                  >
                    Loading
                  </p>
                  <h1
                    className="text-white text-2xl font-bold tracking-wide"
                    style={{ fontFamily: "Orbitron, monospace" }}
                  >
                    VIRK TECH
                  </h1>
                </div>

                {/* Progress bar */}
                <div className="w-72 flex flex-col gap-2">
                  <div
                    className="relative h-1 rounded-full overflow-hidden"
                    style={{ background: "rgba(255,255,255,0.08)" }}
                  >
                    <motion.div
                      className="absolute inset-y-0 left-0 rounded-full"
                      style={{
                        background: "linear-gradient(90deg, #f97316, #ea580c)",
                        width: `${progress}%`,
                        boxShadow: "0 0 12px rgba(249,115,22,0.9)",
                      }}
                    />
                  </div>
                  <p
                    className="text-white/40 text-xs text-right tabular-nums"
                    style={{ fontFamily: "Space Grotesk, sans-serif" }}
                  >
                    {progress}%
                  </p>
                </div>
              </motion.div>
            )}

            {(phase === "hello" || phase === "welcome") && (
              <motion.div
                key="greeting"
                className="flex flex-col items-center gap-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <motion.p
                  className="text-white text-5xl font-light"
                  style={{ fontFamily: "Space Grotesk, sans-serif" }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  Hello...
                </motion.p>
                {phase === "welcome" && (
                  <motion.div
                    className="text-center"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                  >
                    <p
                      className="text-transparent bg-clip-text text-4xl font-bold"
                      style={{
                        fontFamily: "Orbitron, monospace",
                        backgroundImage: "linear-gradient(135deg, #fb923c, #fdba74)",
                      }}
                    >
                      Welcome to Virk Tech
                    </p>
                  </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
