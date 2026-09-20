import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

interface PopOutTransitionProps {
    children: React.ReactNode;
    videoSrc: string;
    to: string; // route to navigate to once the transition finishes
    className?: string;
}

interface Rect {
    top: number;
    left: number;
    width: number;
    height: number;
}

const PopOutTransition = ({ children, videoSrc, to, className = "" }: PopOutTransitionProps) => {
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

        // let the overlay mount at the origin rect first, then expand on the next frame
        requestAnimationFrame(() => {
            requestAnimationFrame(() => setPhase("expanded"));
        });
    };

    const handleVideoEnded = () => {
        navigate(to);
    };

    const isTransitioning = phase !== "idle";

    return (
        <>
            <div ref={triggerRef} onClick={handleClick} className={`cursor-pointer ${className}`}>
                {children}
            </div>

            {isTransitioning && rect && (
                <div
                    className="fixed z-[999] overflow-hidden bg-[#151515]"
                    style={{
                        top: phase === "expanded" ? 0 : rect.top,
                        left: phase === "expanded" ? 0 : rect.left,
                        width: phase === "expanded" ? "100vw" : rect.width,
                        height: phase === "expanded" ? "100vh" : rect.height,
                        borderRadius: phase === "expanded" ? 0 : 24,
                        transition:
                            "top 0.65s cubic-bezier(0.65,0,0.35,1), left 0.65s cubic-bezier(0.65,0,0.35,1), width 0.65s cubic-bezier(0.65,0,0.35,1), height 0.65s cubic-bezier(0.65,0,0.35,1), border-radius 0.65s cubic-bezier(0.65,0,0.35,1)",
                    }}
                >
                    <video
                        src={videoSrc}
                        autoPlay
                        muted
                        playsInline
                        onEnded={handleVideoEnded}
                        className="w-full h-full object-cover"
                    />
                </div>
            )}
        </>
    );
};

export default PopOutTransition;