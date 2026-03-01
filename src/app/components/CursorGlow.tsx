import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";

export function CursorGlow() {
  const cursorX = useMotionValue(-200);
  const cursorY = useMotionValue(-200);

  // The large trailing orb — springy / lagging
  const springConfig = { stiffness: 80, damping: 22, mass: 0.8 };
  const trailX = useSpring(cursorX, springConfig);
  const trailY = useSpring(cursorY, springConfig);

  // Tighter follow for the small dot
  const dotSpringCfg = { stiffness: 600, damping: 35 };
  const dotX = useSpring(cursorX, dotSpringCfg);
  const dotY = useSpring(cursorY, dotSpringCfg);

  const [visible, setVisible] = useState(false);
  const [clicking, setClicking] = useState(false);
  const [hovering, setHovering] = useState(false);

  useEffect(() => {
    const move = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      if (!visible) setVisible(true);
    };
    const down = () => setClicking(true);
    const up = () => setClicking(false);
    const leave = () => setVisible(false);
    const enter = () => setVisible(true);

    window.addEventListener("mousemove", move);
    window.addEventListener("mousedown", down);
    window.addEventListener("mouseup", up);
    document.addEventListener("mouseleave", leave);
    document.addEventListener("mouseenter", enter);

    // Detect hover on interactive elements
    const interactiveSelector = "a, button, [role='button'], input, select, textarea, label";
    const onOver = (e: MouseEvent) => {
      if ((e.target as Element)?.closest(interactiveSelector)) setHovering(true);
      else setHovering(false);
    };
    window.addEventListener("mouseover", onOver);

    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mousedown", down);
      window.removeEventListener("mouseup", up);
      document.removeEventListener("mouseleave", leave);
      document.removeEventListener("mouseenter", enter);
      window.removeEventListener("mouseover", onOver);
    };
  }, [cursorX, cursorY, visible]);

  return (
    <>
      {/* Hide default cursor site-wide */}
      <style>{`* { cursor: none !important; }`}</style>

      {/* Large glowing orb — trails behind */}
      <motion.div
        className="fixed pointer-events-none z-[99998]"
        style={{
          x: trailX,
          y: trailY,
          translateX: "-50%",
          translateY: "-50%",
          opacity: visible ? 1 : 0,
          width: hovering ? 64 : 48,
          height: hovering ? 64 : 48,
          borderRadius: "50%",
          background: clicking
            ? "radial-gradient(circle, rgba(249,115,22,0.6) 0%, rgba(234,88,12,0.2) 60%, transparent 100%)"
            : "radial-gradient(circle, rgba(249,115,22,0.35) 0%, rgba(234,88,12,0.1) 60%, transparent 100%)",
          boxShadow: clicking
            ? "0 0 30px rgba(249,115,22,0.7)"
            : hovering
            ? "0 0 24px rgba(249,115,22,0.5)"
            : "0 0 16px rgba(249,115,22,0.3)",
          transition: "width 0.2s, height 0.2s, opacity 0.3s",
        }}
      />

      {/* Ring around large orb */}
      <motion.div
        className="fixed pointer-events-none z-[99998]"
        style={{
          x: trailX,
          y: trailY,
          translateX: "-50%",
          translateY: "-50%",
          opacity: visible ? (hovering ? 0.9 : 0.5) : 0,
          width: hovering ? 64 : 48,
          height: hovering ? 64 : 48,
          borderRadius: "50%",
          border: "1px solid rgba(249,115,22,0.6)",
          transition: "width 0.2s, height 0.2s, opacity 0.3s",
        }}
      />

      {/* Small precise dot */}
      <motion.div
        className="fixed pointer-events-none z-[99999]"
        style={{
          x: dotX,
          y: dotY,
          translateX: "-50%",
          translateY: "-50%",
          opacity: visible ? 1 : 0,
          width: clicking ? 6 : hovering ? 8 : 6,
          height: clicking ? 6 : hovering ? 8 : 6,
          borderRadius: "50%",
          background: "linear-gradient(135deg, #f97316, #ea580c)",
          boxShadow: "0 0 8px rgba(249,115,22,0.9)",
          transition: "width 0.15s, height 0.15s, opacity 0.3s",
        }}
      />
    </>
  );
}
