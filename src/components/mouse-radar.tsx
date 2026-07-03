"use client";

import { useEffect, useRef, useState, useCallback } from "react";

// Pre-computed amber/gold rgba colors for performance
const AMBER_BRIGHT = "rgba(245, 158, 11, ";     // #F59E0B
const AMBER_MID = "rgba(217, 119, 6, ";        // #D97706
const AMBER_DIM = "rgba(180, 83, 9, ";         // #B45309

export function MouseRadar() {
  const containerRef = useRef<HTMLDivElement>(null);
  const posRef = useRef({ x: -9999, y: -9999 });
  const rafRef = useRef<number>(0);
  const [isVisible, setIsVisible] = useState(false);
  const idleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pulseElsRef = useRef<(HTMLDivElement | null)[]>([]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    posRef.current = { x: e.clientX, y: e.clientY };

    if (!rafRef.current) {
      rafRef.current = requestAnimationFrame(() => {
        const el = containerRef.current;
        if (!el) return;
        el.style.transform = `translate(${posRef.current.x}px, ${posRef.current.y}px)`;
        rafRef.current = 0;
      });
    }

    setIsVisible((prev) => {
      if (!prev) {
        if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
        idleTimerRef.current = setTimeout(() => setIsVisible(false), 2500);
        return true;
      }
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
      idleTimerRef.current = setTimeout(() => setIsVisible(false), 2500);
      return prev;
    });
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsVisible(false);
  }, []);

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    document.addEventListener("mouseleave", handleMouseLeave);

    // Staggered pulse ring triggers via direct DOM
    const timers: (ReturnType<typeof setTimeout> | ReturnType<typeof setInterval>)[] = [];
    for (let i = 0; i < 4; i++) {
      const startDelay = i * 700;

      const fire = () => {
        const el = pulseElsRef.current[i];
        if (!el) return;
        el.style.animation = "none";
        void el.offsetWidth;
        el.style.animation = "radar-pulse 2.8s cubic-bezier(0, 0.55, 0.45, 1) forwards";
      };

      timers.push(setTimeout(fire, startDelay));
      timers.push(setInterval(fire, 2800) as unknown as ReturnType<typeof setTimeout>);
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
      timers.forEach(clearTimeout);
    };
  }, [handleMouseMove, handleMouseLeave]);

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 42, overflow: "hidden" }}
    >
      <div
        ref={containerRef}
        className="absolute top-0 left-0 will-change-transform"
        style={{
          opacity: isVisible ? 1 : 0,
          transition: "opacity 0.5s ease-out",
          marginLeft: "-350px",
          marginTop: "-350px",
        }}
      >
        {/* Soft ambient radial glow */}
        <div
          className="absolute rounded-full"
          style={{
            width: 700,
            height: 700,
            top: 0,
            left: 0,
            background: `radial-gradient(circle, ${AMBER_BRIGHT}0.126) 0%, ${AMBER_MID}0.054) 40%, transparent 68%)`,
            filter: "blur(6px)",
          }}
        />

        {/* Rotating radar sweep arm */}
        <div
          className="absolute rounded-full"
          style={{
            width: 600,
            height: 600,
            top: 50,
            left: 50,
            background: `conic-gradient(from 0deg, ${AMBER_BRIGHT}0.198) 0deg, ${AMBER_BRIGHT}0.072) 30deg, transparent 70deg, transparent 360deg)`,
            animation: "radar-sweep 3.5s linear infinite",
            maskImage: "radial-gradient(circle, black 15%, transparent 68%)",
            WebkitMaskImage: "radial-gradient(circle, black 15%, transparent 68%)",
          }}
        />

        {/* Static grid rings */}
        {[0.2, 0.45, 0.7, 0.95].map((scale) => (
          <div
            key={`grid-${scale}`}
            className="absolute rounded-full"
            style={{
              width: Math.round(580 * scale),
              height: Math.round(580 * scale),
              top: Math.round(60 + 290 * (1 - scale)),
              left: Math.round(60 + 290 * (1 - scale)),
              border: `1px solid ${AMBER_BRIGHT}0.072)`,
            }}
          />
        ))}

        {/* Cross-hair lines */}
        <div
          className="absolute"
          style={{
            width: 580,
            height: 1,
            top: 350,
            left: 60,
            background: `linear-gradient(90deg, transparent, ${AMBER_BRIGHT}0.063) 25%, ${AMBER_BRIGHT}0.063) 75%, transparent)`,
          }}
        />
        <div
          className="absolute"
          style={{
            width: 1,
            height: 580,
            top: 60,
            left: 350,
            background: `linear-gradient(180deg, transparent, ${AMBER_BRIGHT}0.063) 25%, ${AMBER_BRIGHT}0.063) 75%, transparent)`,
          }}
        />

        {/* Center core dot */}
        <div
          className="absolute rounded-full"
          style={{
            width: 8,
            height: 8,
            top: 346,
            left: 346,
            background: `${AMBER_BRIGHT}0.63)`,
            boxShadow: `0 0 16px 4px ${AMBER_BRIGHT}0.315), 0 0 40px 8px ${AMBER_MID}0.135)`,
          }}
        />

        {/* Pulse rings */}
        {[0, 1, 2, 3].map((i) => (
          <div
            key={`pulse-${i}`}
            ref={(el) => {
              pulseElsRef.current[i] = el;
            }}
            className="absolute rounded-full"
            style={{
              width: 580,
              height: 580,
              top: 60,
              left: 60,
              border: `1.5px solid ${AMBER_BRIGHT}0.36)`,
              opacity: 0,
            }}
          />
        ))}
      </div>
    </div>
  );
}