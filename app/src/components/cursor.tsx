import { useRef, useState } from "react";

interface CursorRandomImageProps {
  images: string[];
  children: React.ReactNode;
  width?: number;
  height?: number;
}

const CursorRandomImage = ({
  images,
  children,
  width = 160,
  height = 110,
}: CursorRandomImageProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [visible, setVisible] = useState(false);
  const [currentImage, setCurrentImage] = useState(images[0]);

  const handleMouseEnter = () => {
    const random = images[Math.floor(Math.random() * images.length)];
    setCurrentImage(random);
    setVisible(true);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    setPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  return (
    <div
      ref={containerRef}
      onMouseEnter={handleMouseEnter}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setVisible(false)}
      className="relative"
    >
      {children}

      <img
        src={currentImage}
        alt=""
        style={{
          position: "absolute",
          left: pos.x,
          top: pos.y,
          width,
          height,
          transform: "translate(-50%, -50%)",
          opacity: visible ? 1 : 0,
          transition: "opacity 0.2s ease",
          pointerEvents: "none",
          objectFit: "cover",
          borderRadius: 8,
          zIndex: 50,
        }}
      />
    </div>
  );
};

export default CursorRandomImage;