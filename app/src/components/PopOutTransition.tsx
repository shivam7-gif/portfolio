import { useRef, useState } from "react";
import XPBootScreen from "./XPBootScreen";
import XPDesktop from "./XPDesktop";

interface PopOutTransitionProps {
  children: React.ReactNode;
  className?: string;
}

interface Rect {
  top: number;
  left: number;
  width: number;
  height: number;
}

type Phase = "idle" | "expanding" | "expanded" | "booting" | "desktop";

const PopOutTransition = ({ children, className = "" }: PopOutTransitionProps) => {
  const triggerRef = useRef<HTMLDivElement>(null);
  const [phase, setPhase] = useState<Phase>("idle");
  const [rect, setRect] = useState<Rect | null>(null);

  const handleClick = () => {
    const el = triggerRef.current;
    if (!el || phase !== "idle") return;

    const bounds = el.getBoundingClientRect();
    setRect({ top: bounds.top, left: bounds.left, width: bounds.width, height: bounds.height });
    setPhase("expanding");

    // mount at the origin rect first, then expand to fullscreen on the next frame
    requestAnimationFrame(() => {
      requestAnimationFrame(() => setPhase("expanded"));
    });
  };

  const handleClose = () => {
    setPhase("idle");
    setRect(null);
  };

  const isTransitioning = phase !== "idle";
  const isFullscreen = phase === "expanded" || phase === "booting" || phase === "desktop";

  return (
    <>
      <div ref={triggerRef} onClick={handleClick} className={`cursor-pointer ${className}`}>
        {children}
      </div>

      {isTransitioning && rect && (
        <div
          className="fixed z-[999] overflow-hidden bg-black"
          style={{
            top: isFullscreen ? 0 : rect.top,
            left: isFullscreen ? 0 : rect.left,
            width: isFullscreen ? "100vw" : rect.width,
            height: isFullscreen ? "100vh" : rect.height,
            borderRadius: isFullscreen ? 0 : 24,
            transition:
              "top 0.6s cubic-bezier(0.65,0,0.35,1), left 0.6s cubic-bezier(0.65,0,0.35,1), width 0.6s cubic-bezier(0.65,0,0.35,1), height 0.6s cubic-bezier(0.65,0,0.35,1), border-radius 0.6s cubic-bezier(0.65,0,0.35,1)",
          }}
          onTransitionEnd={() => {
            if (phase === "expanded") setPhase("booting");
          }}
        >
          {phase === "booting" && <XPBootScreen onDone={() => setPhase("desktop")} />}
          {phase === "desktop" && <XPDesktop onClose={handleClose} />}
        </div>
      )}
    </>
  );
};

export default PopOutTransition;