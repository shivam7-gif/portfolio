import { useRef, useState } from "react";

interface CursorRandomImageProps {
  images: string[];
  children: React.ReactNode;
  width?: number;
  height?: number;
  changeInterval?: number;
}

const CursorRandomImage = ({
  images,
  children,
  width = 160,
  height = 150,
  changeInterval = 220,
}: CursorRandomImageProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const lastIndex = useRef(-1);
  const lastChangeTime = useRef(0);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [visible, setVisible] = useState(false);
  const [currentImage, setCurrentImage] = useState(images[0]);

  const pickRandom = () => {
    let i = Math.floor(Math.random() * images.length);
    if (i === lastIndex.current) i = (i + 1) % images.length;
    lastIndex.current = i;
    return images[i];
  };

  const handleMouseEnter = () => {
    setCurrentImage(pickRandom());
    lastChangeTime.current = Date.now();
    setVisible(true);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    setPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });

    const now = Date.now();
    if (now - lastChangeTime.current > changeInterval) {
      setCurrentImage(pickRandom());
      lastChangeTime.current = now;
    }
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
          left: 0,
          top: 0,
          width,
          height,
          objectFit: "cover",
          borderRadius: 8,
          pointerEvents: "none",
          zIndex: 50,
          transform: `translate(${pos.x}px, ${pos.y}px) translate(-50%, -50%) scale(${
            visible ? 1 : 0.5
          })`,
          opacity: visible ? 1 : 0,
          transition:
            "opacity 0.25s cubic-bezier(.34,1.56,.64,1), transform 1s cubic-bezier(.34,1.56,.64,1)",
        }}
      />
    </div>
  );
};

export default CursorRandomImage;