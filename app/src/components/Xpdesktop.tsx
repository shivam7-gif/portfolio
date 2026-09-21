import { useState } from "react";
import wallpaper from "../assets/xp/bliss_wallpaper.jpg";
import XPWindow from "./XpWindow";

interface DesktopIcon {
  id: string;
  label: string;
  emoji: string;
}

const icons: DesktopIcon[] = [
  { id: "about", label: "About Me", emoji: "🖥️" },
  { id: "projects", label: "My Projects", emoji: "📁" },
  { id: "contact", label: "Contact", emoji: "✉️" },
  { id: "resume", label: "Resume.txt", emoji: "📝" },
  { id: "music", label: "Playlist", emoji: "🎵" },
  { id: "recycle", label: "Recycle Bin", emoji: "🗑️" },
];

interface XPDesktopProps {
  onClose: () => void;
}

const XPDesktop = ({ onClose }: XPDesktopProps) => {
  const [openWindow, setOpenWindow] = useState<DesktopIcon | null>(null);
  const [selectedIcon, setSelectedIcon] = useState<string | null>(null);
  const time = new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div
      className="absolute inset-0 bg-cover bg-center select-none"
      style={{ backgroundImage: `url(${wallpaper})` }}
    >
      {/* Exit button — leaves the XP experience, back to the real site */}
      <button
        onClick={onClose}
        aria-label="Close"
        className="absolute top-3 right-3 z-30 w-7 h-7 rounded-[3px] bg-gradient-to-b from-[#f77b6e] to-[#c23b2c] border border-[#8c2318] text-white text-xs font-bold flex items-center justify-center hover:brightness-110"
      >
        &#10005;
      </button>

      {/* Desktop icons */}
      <div className="absolute top-6 left-6 flex flex-col gap-6">
        {icons.map((icon) => (
          <button
            key={icon.id}
            onClick={() => setSelectedIcon(icon.id)}
            onDoubleClick={() => setOpenWindow(icon)}
            className={`w-20 flex flex-col items-center gap-1 px-1 py-1 rounded ${
              selectedIcon === icon.id
                ? "bg-[#3169c6]/40 outline outline-1 outline-dashed outline-white/70"
                : ""
            }`}
          >
            <span className="text-4xl drop-shadow-md">{icon.emoji}</span>
            <span className="text-white text-xs font-medium text-center leading-tight [text-shadow:1px_1px_1px_rgba(0,0,0,0.8)]">
              {icon.label}
            </span>
          </button>
        ))}
      </div>

      {/* Open window */}
      {openWindow && (
        <XPWindow title={openWindow.label} onClose={() => setOpenWindow(null)}>
          <p className="text-sm text-[#333]">
            Content for <strong>{openWindow.label}</strong> goes here — swap
            this placeholder for real About/Projects/Contact content.
          </p>
        </XPWindow>
      )}

      {/* Taskbar */}
      <div className="absolute bottom-0 left-0 right-0 h-10 flex items-center justify-between bg-gradient-to-b from-[#2a86e8] to-[#1a53c4] border-t border-[#0d3a91] px-2">
        <button className="h-7 px-4 rounded-md bg-gradient-to-b from-[#5ec95e] to-[#2f9c2f] border border-[#1c6e1c] text-white text-sm font-bold italic shadow-sm">
          start
        </button>
        <span className="text-white text-xs font-medium bg-[#0f3f9e] px-3 py-1.5 rounded-sm border border-[#0a2c72]">
          {time}
        </span>
      </div>
    </div>
  );
};

export default XPDesktop;
