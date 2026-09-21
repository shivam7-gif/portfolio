import { useEffect } from "react";
import bootScreen from "../assets/xp/xp_boot_screen.gif";

interface XPBootScreenProps {
  onDone: () => void;
  duration?: number;
}

const XPBootScreen = ({ onDone, duration = 2200 }: XPBootScreenProps) => {
  useEffect(() => {
    const timer = setTimeout(onDone, duration);
    return () => clearTimeout(timer);
  }, [onDone, duration]);

  return (
    <div className="absolute inset-0 bg-black flex items-center justify-center">
      <img
        src={bootScreen}
        alt="Windows XP booting"
        className="w-full h-full object-cover"
      />
    </div>
  );
};

export default XPBootScreen;