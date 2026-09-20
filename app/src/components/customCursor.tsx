import { useEffect, useState } from "react";
import cursorDefault from "../assets/cursor-assets/cursor_left.png";
import cursorClick from "../assets/cursor-assets/cursor_right.png";

const CustomCursor = () => {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [isClicking, setIsClicking] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      setPos({ x: e.clientX, y: e.clientY });
      setVisible(true);
    };
    const handleDown = () => setIsClicking(true);
    const handleUp = () => setIsClicking(false);
    const handleLeave = () => setVisible(false);

    window.addEventListener("mousemove", handleMove);
    window.addEventListener("mousedown", handleDown);
    window.addEventListener("mouseup", handleUp);
    document.documentElement.addEventListener("mouseleave", handleLeave);

    return () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mousedown", handleDown);
      window.removeEventListener("mouseup", handleUp);
      document.documentElement.removeEventListener("mouseleave", handleLeave);
    };
  }, []);

  return (
    <img
      src={isClicking ? cursorClick : cursorDefault}
      alt=""
      style={{
        position: "fixed",
        left: pos.x,
        top: pos.y,
        width: 32,
        height: "auto",
        transform: `translate(-4px, -4px) scale(${isClicking ? 0.9 : 1})`,
        opacity: visible ? 1 : 0,
        pointerEvents: "none",
        zIndex: 9999,
        transition: "transform 0.12s ease-out, opacity 0.15s ease",
      }}
    />
  );
};

export default CustomCursor;