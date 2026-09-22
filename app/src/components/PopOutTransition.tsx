import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

interface PopOutTransitionProps {
  children: React.ReactNode;
  to?: string;
  className?: string;
}

interface Rect {
  top: number;
  left: number;
  width: number;
  height: number;
}

const PopOutTransition = ({ children, to = "/window", className = "" }: PopOutTransitionProps) => {
  const triggerRef = useRef<HTMLDivElement>(null);
  const [phase, setPhase] = useState<"idle" | "expanding" | "expanded">("idle");
  const [rect, setRect] = useState<Rect | null>(null);
  const navigate = useNavigate();

  const handleClick = () => {
    const el = triggerRef.current;
    if (!el || phase !== "idle") return;

    const bounds = el.getBoundingClientRect();
    setRect({ top: bounds.top, left: bounds.left, width: bounds.width, height: bounds.height });
    setPhase("expanding");

    // Mount at the origin rect first, then expand to fullscreen on the next animation frame
    requestAnimationFrame(() => {
      requestAnimationFrame(() => setPhase("expanded"));
    });
  };

  const isTransitioning = phase !== "idle";
  const isFullscreen = phase === "expanded";

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
              "top 0.5s cubic-bezier(0.65,0,0.35,1), left 0.5s cubic-bezier(0.65,0,0.35,1), width 0.5s cubic-bezier(0.65,0,0.35,1), height 0.5s cubic-bezier(0.65,0,0.35,1), border-radius 0.5s cubic-bezier(0.65,0,0.35,1)",
          }}
          onTransitionEnd={() => {
            if (phase === "expanded") {
              navigate(to);
            }
          }}
        />
      )}
    </>
  );
};

export default PopOutTransition;