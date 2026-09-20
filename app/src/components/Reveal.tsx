import { useEffect, useRef, useState } from "react";

interface RevealProps {
  children: React.ReactNode;
  className?: string;
  /** how much of the element must be visible before it triggers (0–1) */
  threshold?: number;
  /** spring stiffness: lower = slower to start falling into place */
  stiffness?: number;
  /** spring damping: lower = more overshoot/lag before it settles, higher = settles faster */
  damping?: number;
}

const Reveal = ({
  children,
  className = "",
  threshold = 0.3,
  stiffness = 0.07,
  damping = 0.88,
}: RevealProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const active = useRef(false);
  const progress = useRef(0);
  const velocity = useRef(0);
  const rafId = useRef<number | null>(null);
  const [visualProgress, setVisualProgress] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !active.current) {
          active.current = true;
          observer.disconnect(); // fires once per section, not on every scroll after
        }
      },
      { threshold }
    );
    observer.observe(el);

    const loop = () => {
      if (active.current) {
        // spring toward target = 1. Low damping lets it overshoot past 1 (the "drop"),
        // decelerate there (the "lag"), then swing back to settle (the "go forward")
        const force = (1 - progress.current) * stiffness;
        velocity.current = (velocity.current + force) * damping;
        progress.current += velocity.current;
      }
      setVisualProgress(progress.current);
      rafId.current = requestAnimationFrame(loop);
    };
    rafId.current = requestAnimationFrame(loop);

    return () => {
      observer.disconnect();
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, [threshold, stiffness, damping]);

  const opacity = Math.max(0, Math.min(1, visualProgress));
  // translateY uses the unclamped progress so it can genuinely overshoot past 0 before settling
  const translateY = (1 - visualProgress) * 50;

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity,
        transform: `translateY(${translateY}px)`,
      }}
    >
      {children}
    </div>
  );
};

export default Reveal;
