import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

// XP visual assets
import bliss from "../assets/xp/bliss_wallpaper.jpg";
import bootGif from "../assets/xp/xp_boot_screen.gif";
import iconAboutMe from "../assets/xp/icons/about_me.png";
import iconProjects from "../assets/xp/icons/projects.png";
import iconContact from "../assets/xp/icons/contact.png";
import iconResume from "../assets/xp/icons/resume.png";
import iconPlaylist from "../assets/xp/icons/playlist.png";
import iconRecycleBin from "../assets/xp/icons/recycle_bin.png";
import pointing from "../assets/CursorImages/pointing.jpg";
import ChromeBrowser, { CHROME_ICON } from "../components/ChromeBrowser";

// XP audio assets
import soundStartup from "../assets/voices/window_startup.wav";
import soundShutdown from "../assets/voices/window_shutdown.wav";

interface DesktopItem {
  id: string;
  label: string;
  icon: string;
  x: number;
  y: number;
}

const initialDesktopIcons: DesktopItem[] = [
  { id: "chrome", label: "Google Chrome", icon: CHROME_ICON, x: 24, y: 20 },
  { id: "about", label: "About Me", icon: iconAboutMe, x: 24, y: 108 },
  { id: "projects", label: "My Projects", icon: iconProjects, x: 24, y: 196 },
  { id: "contact", label: "Contact", icon: iconContact, x: 24, y: 284 },
  { id: "resume", label: "Resume.txt", icon: iconResume, x: 24, y: 372 },
  { id: "playlist", label: "Playlist", icon: iconPlaylist, x: 24, y: 460 },
  { id: "recycle", label: "Recycle Bin", icon: iconRecycleBin, x: 24, y: 548 },
];

interface WindowState {
  id: string;
  title: string;
  icon: string;
  isMinimized: boolean;
  isMaximized: boolean;
  x: number;
  y: number;
  width: number;
  height: number;
  zIndex: number;
}

interface SelectionBox {
  startX: number;
  startY: number;
  currentX: number;
  currentY: number;
}

interface ContextMenuState {
  x: number;
  y: number;
  type: "desktop" | "icon";
  targetId?: string;
}

export default function Window() {
  const navigate = useNavigate();

  // Startup state
  const [startupStage, setStartupStage] = useState<"video" | "desktop">("video");
  const [shuttingDown, setShuttingDown] = useState(false);
  const [showTurnOffDialog, setShowTurnOffDialog] = useState(false);

  // Desktop items & selection
  const [icons, setIcons] = useState<DesktopItem[]>(initialDesktopIcons);
  const [selectedIconIds, setSelectedIconIds] = useState<string[]>([]);
  const [selectionBox, setSelectionBox] = useState<SelectionBox | null>(null);

  // Windows state
  const [openWindows, setOpenWindows] = useState<Record<string, WindowState>>({});
  const [activeWindowId, setActiveWindowId] = useState<string | null>(null);

  // UI elements
  const [startMenuOpen, setStartMenuOpen] = useState(false);
  const [contextMenu, setContextMenu] = useState<ContextMenuState | null>(null);
  const [volumeSliderOpen, setVolumeSliderOpen] = useState(false);
  const [volume, setVolume] = useState(80);
  const [time, setTime] = useState(() =>
    new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  );

  const topZIndex = useRef(30);

  const hasMaximizedWindow = Object.values(openWindows).some(
    (win) => !win.isMinimized && win.isMaximized
  );

  // Dragging states
  const dragTargetRef = useRef<
    | {
        type: "icon";
        id: string;
        startX: number;
        startY: number;
        initialX: number;
        initialY: number;
        hasMoved: boolean;
      }
    | {
        type: "window";
        id: string;
        startX: number;
        startY: number;
        initialX: number;
        initialY: number;
      }
    | {
        type: "resize";
        id: string;
        startX: number;
        startY: number;
        initialW: number;
        initialH: number;
      }
    | null
  >(null);

  // Play startup sound when boot finishes
  const playStartupSound = () => {
    try {
      const audio = new Audio(soundStartup);
      audio.volume = volume / 100;
      audio.play().catch(() => {
        // Autoplay may be blocked by browser policy without user gesture
      });
    } catch (e) {
      console.warn("Could not play startup sound:", e);
    }
  };

  const handleFinishStartup = () => {
    setStartupStage("desktop");
    playStartupSound();
  };

  // Boot timer: after 2.2s of boot video, transition to desktop & chime
  useEffect(() => {
    if (startupStage === "video") {
      const timer = setTimeout(() => {
        handleFinishStartup();
      }, 2200);
      return () => clearTimeout(timer);
    }
  }, [startupStage]);

  // Live system clock updater
  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }));
    }, 15000);
    return () => clearInterval(interval);
  }, []);

  // Global mouse move & up listeners for dragging icons, moving windows, resizing windows, and marquee selection
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // 1. Moving or resizing
      if (dragTargetRef.current) {
        const drag = dragTargetRef.current;
        const dx = e.clientX - drag.startX;
        const dy = e.clientY - drag.startY;

        if (drag.type === "icon") {
          if (Math.abs(dx) > 3 || Math.abs(dy) > 3) {
            drag.hasMoved = true;
          }
          setIcons((prev) =>
            prev.map((item) => {
              if (item.id === drag.id) {
                const newX = Math.max(0, Math.min(window.innerWidth - 80, drag.initialX + dx));
                const newY = Math.max(0, Math.min(window.innerHeight - 100, drag.initialY + dy));
                return { ...item, x: newX, y: newY };
              }
              return item;
            })
          );
        } else if (drag.type === "window") {
          setOpenWindows((prev) => {
            const win = prev[drag.id];
            if (!win || win.isMaximized) return prev;
            return {
              ...prev,
              [drag.id]: {
                ...win,
                x: Math.max(0, Math.min(window.innerWidth - 120, drag.initialX + dx)),
                y: Math.max(0, Math.min(window.innerHeight - 80, drag.initialY + dy)),
              },
            };
          });
        } else if (drag.type === "resize") {
          setOpenWindows((prev) => {
            const win = prev[drag.id];
            if (!win || win.isMaximized) return prev;
            return {
              ...prev,
              [drag.id]: {
                ...win,
                width: Math.max(340, Math.min(window.innerWidth - win.x, drag.initialW + dx)),
                height: Math.max(220, Math.min(window.innerHeight - 36 - win.y, drag.initialH + dy)),
              },
            };
          });
        }
        return;
      }

      // 2. Marquee selection box on desktop
      if (selectionBox) {
        setSelectionBox((prev) => (prev ? { ...prev, currentX: e.clientX, currentY: e.clientY } : null));

        // Update selected icons based on intersection
        const x1 = Math.min(selectionBox.startX, e.clientX);
        const y1 = Math.min(selectionBox.startY, e.clientY);
        const x2 = Math.max(selectionBox.startX, e.clientX);
        const y2 = Math.max(selectionBox.startY, e.clientY);

        const intersecting = icons
          .filter((icon) => {
            const iconRight = icon.x + 75;
            const iconBottom = icon.y + 75;
            return icon.x < x2 && iconRight > x1 && icon.y < y2 && iconBottom > y1;
          })
          .map((i) => i.id);

        setSelectedIconIds(intersecting);
      }
    };

    const handleMouseUp = () => {
      dragTargetRef.current = null;
      if (selectionBox) {
        setSelectionBox(null);
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [selectionBox, icons]);

  // Window management functions
  const openApp = (item: { id: string; label: string; icon: string }) => {
    topZIndex.current += 1;
    setOpenWindows((prev) => {
      if (prev[item.id]) {
        return {
          ...prev,
          [item.id]: {
            ...prev[item.id],
            isMinimized: false,
            zIndex: topZIndex.current,
          },
        };
      }

      const count = Object.keys(prev).length;
      const offset = (count % 6) * 32;
      const defaultX = Math.min(window.innerWidth - 560, Math.max(40, 120 + offset));
      const defaultY = Math.min(window.innerHeight - 440, Math.max(30, 50 + offset));

      const isChrome = item.id === "chrome";
      const defaultWidth = isChrome
        ? Math.min(880, window.innerWidth - 40)
        : Math.min(540, window.innerWidth - 60);
      const defaultHeight = isChrome
        ? Math.min(580, window.innerHeight - 80)
        : Math.min(420, window.innerHeight - 100);

      return {
        ...prev,
        [item.id]: {
          id: item.id,
          title: item.label,
          icon: item.icon,
          isMinimized: false,
          isMaximized: false,
          x: defaultX,
          y: defaultY,
          width: defaultWidth,
          height: defaultHeight,
          zIndex: topZIndex.current,
        },
      };
    });
    setActiveWindowId(item.id);
    setStartMenuOpen(false);
  };

  const closeWindow = (id: string) => {
    setOpenWindows((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
    if (activeWindowId === id) setActiveWindowId(null);
  };

  const minimizeWindow = (id: string) => {
    setOpenWindows((prev) => ({
      ...prev,
      [id]: { ...prev[id], isMinimized: true },
    }));
    if (activeWindowId === id) setActiveWindowId(null);
  };

  const toggleMaximizeWindow = (id: string) => {
    setOpenWindows((prev) => ({
      ...prev,
      [id]: { ...prev[id], isMaximized: !prev[id].isMaximized },
    }));
  };

  const focusWindow = (id: string) => {
    topZIndex.current += 1;
    setOpenWindows((prev) => {
      if (!prev[id]) return prev;
      return {
        ...prev,
        [id]: { ...prev[id], isMinimized: false, zIndex: topZIndex.current },
      };
    });
    setActiveWindowId(id);
  };

  // Dragging windows
  const startWindowDrag = (id: string, e: React.MouseEvent) => {
    const win = openWindows[id];
    if (!win || win.isMaximized) return;
    focusWindow(id);
    dragTargetRef.current = {
      type: "window",
      id,
      startX: e.clientX,
      startY: e.clientY,
      initialX: win.x,
      initialY: win.y,
    };
  };

  // Resizing windows
  const startWindowResize = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const win = openWindows[id];
    if (!win || win.isMaximized) return;
    focusWindow(id);
    dragTargetRef.current = {
      type: "resize",
      id,
      startX: e.clientX,
      startY: e.clientY,
      initialW: win.width,
      initialH: win.height,
    };
  };

  // Dragging desktop icons
  const startIconDrag = (id: string, e: React.MouseEvent) => {
    if (e.button !== 0) return; // Only left-click
    e.stopPropagation();
    const item = icons.find((i) => i.id === id);
    if (!item) return;

    if (!selectedIconIds.includes(id)) {
      setSelectedIconIds([id]);
    }

    dragTargetRef.current = {
      type: "icon",
      id,
      startX: e.clientX,
      startY: e.clientY,
      initialX: item.x,
      initialY: item.y,
      hasMoved: false,
    };
  };

  // Execute authentic XP Shutdown
  const executeShutdown = () => {
    setShowTurnOffDialog(false);
    setShuttingDown(true);
    try {
      const audio = new Audio(soundShutdown);
      audio.volume = volume / 100;
      audio.play().catch(() => {});
    } catch (e) {
      console.warn("Could not play shutdown sound:", e);
    }

    setTimeout(() => {
      navigate("/");
    }, 2800);
  };

  // Startup video boot screen
  if (startupStage === "video") {
    return (
      <div
        className="fixed inset-0 bg-black flex flex-col items-center justify-center select-none z-50 cursor-pointer"
        onClick={handleFinishStartup}
        title="Click to continue"
      >
        <img
          src={bootGif}
          alt="Windows XP booting"
          className="w-full h-full max-w-4xl max-h-[85vh] object-contain"
        />
        <div className="absolute bottom-6 flex flex-col items-center gap-1.5">
          <p className="text-neutral-400 text-xs tracking-wider animate-pulse font-sans">
            Click anywhere or press any key to skip
          </p>
        </div>
      </div>
    );
  }

  // Authentic Windows is shutting down screen
  if (shuttingDown) {
    return (
      <div className="fixed inset-0 bg-[#001D85] flex flex-col items-center justify-center text-white select-none z-50 font-sans">
        <div className="flex items-center gap-3">
          <div className="flex flex-col items-start">
            <span className="font-['Clash_Display',sans-serif] text-2xl font-black italic tracking-wide">
              Microsoft<sup className="text-xs">&reg;</sup> Windows<sup className="text-xs">XP</sup>
            </span>
            <span className="text-sm font-semibold text-[#8eb9f5] mt-1">Windows is shutting down...</span>
          </div>
        </div>
        <div className="mt-8 flex gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-white/70 animate-bounce"></span>
          <span className="w-2.5 h-2.5 rounded-full bg-white/70 animate-bounce [animation-delay:0.15s]"></span>
          <span className="w-2.5 h-2.5 rounded-full bg-white/70 animate-bounce [animation-delay:0.3s]"></span>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`fixed inset-0 bg-cover bg-center select-none overflow-hidden font-sans transition-all duration-300 ${
        showTurnOffDialog ? "grayscale contrast-75 brightness-75" : ""
      }`}
      style={{ backgroundImage: `url(${bliss})` }}
      onMouseDown={(e) => {
        // Start marquee selection when clicking directly on wallpaper
        if (e.target === e.currentTarget && e.button === 0) {
          setSelectionBox({
            startX: e.clientX,
            startY: e.clientY,
            currentX: e.clientX,
            currentY: e.clientY,
          });
          setSelectedIconIds([]);
        }
        if (startMenuOpen) setStartMenuOpen(false);
        if (contextMenu) setContextMenu(null);
        if (volumeSliderOpen) setVolumeSliderOpen(false);
      }}
      onContextMenu={(e) => {
        e.preventDefault();
        setContextMenu({ x: e.clientX, y: e.clientY, type: "desktop" });
      }}
    >
      {/* Top Right Quick Exit / Shutdown Button (hidden when any window is maximized to prevent overlapping title bar controls) */}
      {!hasMaximizedWindow && (
        <div className="absolute top-3 right-3 z-10 flex items-center gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowTurnOffDialog(true);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-[4px] bg-gradient-to-b from-[#d9534f] to-[#b52b27] hover:from-[#e25d59] hover:to-[#c63430] border border-[#7e1c18] text-white text-xs font-bold shadow-md active:translate-y-0.5 transition-all cursor-pointer"
            title="Turn Off Computer"
          >
            <div className="w-3.5 h-3.5 rounded-full bg-white/20 flex items-center justify-center">
              <svg className="w-2.5 h-2.5" viewBox="0 0 16 16" fill="currentColor">
                <path d="M7 1h2v6H7V1zm4.7 1.8l-1.4 1.4A4.95 4.95 0 0113 7c0 2.8-2.2 5-5 5s-5-2.2-5-5c0-1.4.6-2.7 1.6-3.6L3.2 2C1.9 3.2 1 5 1 7c0 3.9 3.1 7 7 7s7-3.1 7-7c0-2-.9-3.8-2.3-5.2z" />
              </svg>
            </div>
            <span>Turn Off</span>
          </button>
        </div>
      )}

      {/* Draggable Desktop Icons */}
      {icons.map((item) => {
        const isSelected = selectedIconIds.includes(item.id);
        return (
          <div
            key={item.id}
            style={{
              transform: `translate3d(${item.x}px, ${item.y}px, 0)`,
              position: "absolute",
              top: 0,
              left: 0,
            }}
            onMouseDown={(e) => startIconDrag(item.id, e)}
            onClick={(e) => {
              e.stopPropagation();
              if (dragTargetRef.current?.type === "icon" && dragTargetRef.current.hasMoved) return;
              setSelectedIconIds([item.id]);
            }}
            onDoubleClick={(e) => {
              e.stopPropagation();
              openApp(item);
            }}
            onContextMenu={(e) => {
              e.stopPropagation();
              e.preventDefault();
              setSelectedIconIds([item.id]);
              setContextMenu({ x: e.clientX, y: e.clientY, type: "icon", targetId: item.id });
            }}
            className={`w-[76px] p-1 flex flex-col items-center gap-1 rounded cursor-pointer transition-shadow z-10 ${
              isSelected
                ? "bg-[#3169c6]/45 outline outline-1 outline-dashed outline-white/80"
                : "hover:bg-white/10"
            }`}
          >
            <img
              src={item.icon}
              alt={item.label}
              draggable={false}
              className="w-11 h-11 drop-shadow-md pointer-events-none select-none"
            />
            <span className="text-white text-[11px] font-medium text-center leading-tight [text-shadow:1px_1px_2px_rgba(0,0,0,0.95)] break-words w-full pointer-events-none select-none">
              {item.label}
            </span>
          </div>
        );
      })}

      {/* Marquee Selection Rectangle Box */}
      {selectionBox && (
        <div
          className="absolute border border-[#3169c6] bg-[#3169c6]/25 pointer-events-none z-20"
          style={{
            left: Math.min(selectionBox.startX, selectionBox.currentX),
            top: Math.min(selectionBox.startY, selectionBox.currentY),
            width: Math.abs(selectionBox.currentX - selectionBox.startX),
            height: Math.abs(selectionBox.currentY - selectionBox.startY),
          }}
        />
      )}

      {/* Open Windows */}
      {Object.values(openWindows).map((win) => {
        if (win.isMinimized) return null;
        const isActive = activeWindowId === win.id;

        return (
          <div
            key={win.id}
            onMouseDown={() => focusWindow(win.id)}
            style={{
              zIndex: win.zIndex,
              ...(win.isMaximized
                ? {
                    top: 0,
                    left: 0,
                    width: "100vw",
                    height: "calc(100vh - 36px)",
                    borderRadius: 0,
                  }
                : {
                    top: win.y,
                    left: win.x,
                    width: win.width,
                    height: win.height,
                    borderRadius: "8px 8px 0 0",
                  }),
            }}
            className={`absolute flex flex-col overflow-hidden shadow-2xl border ${
              isActive ? "border-[#0055ea]" : "border-[#7a96df]"
            }`}
          >
            {/* Window XP Title Bar */}
            <div
              onMouseDown={(e) => startWindowDrag(win.id, e)}
              onDoubleClick={() => toggleMaximizeWindow(win.id)}
              className={`h-8 px-2 flex items-center justify-between cursor-move select-none ${
                isActive
                  ? "bg-gradient-to-r from-[#0058e5] via-[#2476f7] to-[#0058e5]"
                  : "bg-gradient-to-r from-[#7996df] via-[#94aee9] to-[#7996df]"
              }`}
            >
              <div className="flex items-center gap-2 text-white text-xs font-bold drop-shadow-sm truncate">
                <img src={win.icon} alt="" className="w-4 h-4 shrink-0 pointer-events-none" />
                <span className="truncate">{win.title}</span>
              </div>

              {/* Title Bar Controls */}
              <div
                className="flex items-center gap-1 shrink-0"
                onMouseDown={(e) => e.stopPropagation()}
              >
                <button
                  onClick={() => minimizeWindow(win.id)}
                  aria-label="Minimize"
                  className="w-5 h-5 rounded-[3px] bg-gradient-to-b from-[#5f9df7] to-[#2f6fd6] hover:brightness-110 active:brightness-90 border border-[#1149b3] text-white flex items-center justify-center shadow-inner cursor-pointer"
                >
                  <svg className="w-2 h-2 pointer-events-none" viewBox="0 0 10 10" fill="none">
                    <line x1="1" y1="8" x2="9" y2="8" stroke="white" strokeWidth="2" strokeLinecap="square" />
                  </svg>
                </button>
                <button
                  onClick={() => toggleMaximizeWindow(win.id)}
                  aria-label={win.isMaximized ? "Restore" : "Maximize"}
                  className="w-5 h-5 rounded-[3px] bg-gradient-to-b from-[#5f9df7] to-[#2f6fd6] hover:brightness-110 active:brightness-90 border border-[#1149b3] text-white flex items-center justify-center shadow-inner cursor-pointer"
                >
                  {win.isMaximized ? (
                    <svg className="w-2.5 h-2.5 pointer-events-none" viewBox="0 0 10 10" fill="none">
                      <path d="M3.5 3V1.5h5v5H7" stroke="white" strokeWidth="1.2" />
                      <rect x="1.5" y="3.5" width="5.5" height="5" fill="#2f6fd6" stroke="white" strokeWidth="1.2" />
                    </svg>
                  ) : (
                    <svg className="w-2.5 h-2.5 pointer-events-none" viewBox="0 0 10 10" fill="none">
                      <rect x="1.5" y="1.5" width="7" height="7" stroke="white" strokeWidth="1.4" />
                    </svg>
                  )}
                </button>
                <button
                  onClick={() => closeWindow(win.id)}
                  aria-label="Close"
                  className="w-5 h-5 rounded-[3px] bg-gradient-to-b from-[#e8533c] to-[#ba2712] hover:brightness-110 active:brightness-90 border border-[#7a180a] text-white flex items-center justify-center shadow-inner cursor-pointer"
                >
                  <svg className="w-2.5 h-2.5 pointer-events-none" viewBox="0 0 10 10" fill="none">
                    <path d="M2 2L8 8M8 2L2 8" stroke="white" strokeWidth="1.8" strokeLinecap="square" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Window Content */}
            {win.id === "chrome" ? (
              <div className="flex-1 overflow-hidden flex flex-col bg-white">
                <ChromeBrowser />
              </div>
            ) : (
              <div className="flex-1 bg-[#ECE9D8] text-[#111] overflow-auto p-4 flex flex-col font-sans text-sm relative">
                {win.id === "about" && (
                <div className="space-y-4">
                  <div className="flex items-center gap-4 bg-white p-3 rounded border border-[#7F9DB9] shadow-inner">
                    <img
                      src={pointing}
                      alt="Avatar"
                      className="w-20 h-24 object-cover rounded border border-[#999] shadow-sm"
                    />
                    <div>
                      <h2 className="text-base font-bold text-[#0C3278]">Shivam</h2>
                      <p className="text-xs text-neutral-600">Software Engineer & Creative Developer</p>
                      <div className="mt-2 inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-medium">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                        Available for opportunities
                      </div>
                    </div>
                  </div>

                  <div className="bg-white p-3 rounded border border-[#7F9DB9] shadow-inner space-y-2">
                    <h3 className="font-bold text-xs uppercase text-neutral-500 tracking-wider">
                      Technical Skills
                    </h3>
                    <div className="flex flex-wrap gap-1.5">
                      {[
                        "React",
                        "TypeScript",
                        "JavaScript",
                        "Tailwind CSS",
                        "Node.js",
                        "Vite",
                        "REST APIs",
                        "Git",
                      ].map((skill) => (
                        <span
                          key={skill}
                          className="px-2 py-0.5 bg-[#EEF3FA] text-[#1b4fa0] border border-[#B2C6E6] rounded text-xs font-semibold"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  <p className="text-xs text-neutral-700 leading-relaxed bg-[#f8f7f0] p-2.5 rounded border border-[#d6d2c4]">
                    Passionate about building responsive, accessible, and delightful interactive web
                    applications with modern technologies and retro charm.
                  </p>
                </div>
              )}

              {win.id === "projects" && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-[#C0B9A8]">
                    <span className="text-xs font-bold text-[#1149b3]">C:\Projects\Directory</span>
                    <span className="text-[11px] text-neutral-500">2 items found</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="bg-white p-3 rounded border border-[#7F9DB9] shadow-sm flex flex-col justify-between hover:border-[#1149b3] transition-colors">
                      <div>
                        <h4 className="font-bold text-[#0C3278] text-sm">Portfolio OS</h4>
                        <p className="text-xs text-neutral-600 mt-1">
                          A nostalgic interactive Windows XP desktop experience built inside a modern React +
                          Tailwind application.
                        </p>
                      </div>
                      <div className="mt-3 pt-2 border-t border-neutral-100 flex items-center justify-between text-xs font-semibold">
                        <span className="text-neutral-500 text-[10px]">React • Tailwind</span>
                        <span className="text-[#1149b3] hover:underline cursor-pointer">Explore &rarr;</span>
                      </div>
                    </div>

                    <div className="bg-white p-3 rounded border border-[#7F9DB9] shadow-sm flex flex-col justify-between hover:border-[#1149b3] transition-colors">
                      <div>
                        <h4 className="font-bold text-[#0C3278] text-sm">Web Application Platform</h4>
                        <p className="text-xs text-neutral-600 mt-1">
                          High performance full-stack application featuring responsive layouts, custom cursor
                          interactions, and modern routing.
                        </p>
                      </div>
                      <div className="mt-3 pt-2 border-t border-neutral-100 flex items-center justify-between text-xs font-semibold">
                        <span className="text-neutral-500 text-[10px]">TypeScript • Vite</span>
                        <span className="text-[#1149b3] hover:underline cursor-pointer">Explore &rarr;</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {win.id === "contact" && (
                <div className="space-y-3">
                  <div className="bg-white p-3 rounded border border-[#7F9DB9] space-y-2 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="w-14 text-neutral-500 font-bold">To:</span>
                      <span className="text-[#1149b3] font-semibold">shivamsrawat7@gmail.com</span>
                    </div>
                    <div className="flex items-center gap-2 border-t border-neutral-100 pt-2">
                      <span className="w-14 text-neutral-500 font-bold">Subject:</span>
                      <input
                        type="text"
                        placeholder="Say hello or discuss an opportunity..."
                        className="flex-1 px-2 py-1 border border-[#7F9DB9] rounded bg-[#FFF] outline-none focus:border-[#1149b3]"
                      />
                    </div>
                    <div className="flex flex-col gap-1 border-t border-neutral-100 pt-2">
                      <span className="text-neutral-500 font-bold">Message:</span>
                      <textarea
                        rows={4}
                        placeholder="Write your note here..."
                        className="w-full px-2 py-1 border border-[#7F9DB9] rounded bg-[#FFF] outline-none focus:border-[#1149b3] resize-none"
                      />
                    </div>
                    <div className="flex justify-end pt-1">
                      <button
                        onClick={() => alert("Thank you! Please email me directly at shivamsrawat7@gmail.com")}
                        className="px-4 py-1 rounded bg-gradient-to-b from-[#5ec95e] to-[#2f9c2f] hover:brightness-105 border border-[#1c6e1c] text-white text-xs font-bold shadow-sm"
                      >
                        Send Note
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {win.id === "resume" && (
                <div className="flex flex-col h-full bg-white border border-[#7F9DB9] p-3 font-mono text-xs overflow-auto">
                  <div className="text-neutral-400 text-[10px] pb-2 border-b border-neutral-200 mb-2">
                    Notepad - Resume.txt
                  </div>
                  <pre className="whitespace-pre-wrap text-neutral-800 leading-relaxed font-sans text-xs">
                    {`SHIVAM
Software Engineer

----------------------------------------
EXPERIENCE & SKILLS
----------------------------------------
Frontend:  React, TypeScript, JavaScript, Tailwind CSS, HTML5, CSS3
Tools:     Vite, Git, GitHub, VS Code
Patterns:  Responsive Design, Component Architecture, Micro-Interactions

----------------------------------------
HIGHLIGHTS
----------------------------------------
• Architected modular component designs for interactive portfolio platforms.
• Built authentic Windows XP retro interface simulation within React.
• Focused on performance, smooth animations, and clean UI engineering.`}
                  </pre>
                </div>
              )}

              {win.id === "playlist" && (
                <div className="space-y-3">
                  <div className="bg-[#1A1A1A] p-3 rounded-t border border-[#333] text-white text-xs flex items-center justify-between">
                    <span className="font-bold text-[#5ec95e]">XP Media Player 9.0</span>
                    <span className="text-[10px] text-neutral-400">Audio Ready</span>
                  </div>
                  <div className="bg-white p-2 rounded border border-[#7F9DB9] divide-y divide-neutral-100 text-xs">
                    {[
                      { title: "Windows XP Startup Sound", duration: "0:04", artist: "Microsoft" },
                      { title: "Windows XP Shutdown Sound", duration: "0:04", artist: "Microsoft" },
                      { title: "Lofi Retro Coding Beats", duration: "2:45", artist: "Synthwave" },
                      { title: "Bliss Hill Reverie", duration: "3:12", artist: "Ambient" },
                    ].map((track, i) => (
                      <div
                        key={i}
                        onClick={() => {
                          if (i === 0) {
                            playStartupSound();
                          } else if (i === 1) {
                            const audio = new Audio(soundShutdown);
                            audio.volume = volume / 100;
                            audio.play().catch(() => {});
                          }
                        }}
                        className="py-2 px-1 flex items-center justify-between hover:bg-[#EEF3FA] cursor-pointer rounded"
                      >
                        <div className="flex items-center gap-2">
                          <svg className="w-2.5 h-2.5 text-neutral-500 fill-current shrink-0" viewBox="0 0 10 10">
                            <polygon points="2,1 9,5 2,9" />
                          </svg>
                          <span className="font-semibold text-neutral-800">{track.title}</span>
                          <span className="text-[10px] text-neutral-500">({track.artist})</span>
                        </div>
                        <span className="text-neutral-500 text-[11px] font-mono">{track.duration}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {win.id === "recycle" && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-[#C0B9A8]">
                    <span className="text-xs font-bold text-neutral-700">Recycle Bin Items</span>
                    <button
                      onClick={() => alert("Recycle bin emptied!")}
                      className="px-2 py-0.5 bg-[#EDE8D6] hover:bg-white border border-[#999] rounded text-[11px] font-semibold"
                    >
                      Empty Bin
                    </button>
                  </div>
                  <div className="space-y-1.5 text-xs text-neutral-700">
                    <div className="p-2 bg-white rounded border border-[#DDD] flex items-center justify-between">
                      <span>Sleep_Schedule_2026.sys</span>
                      <span className="text-neutral-400 text-[11px]">0 KB</span>
                    </div>
                    <div className="p-2 bg-white rounded border border-[#DDD] flex items-center justify-between">
                      <span>Bugs_Fixed_Final_v2.dll</span>
                      <span className="text-neutral-400 text-[11px]">42 KB</span>
                    </div>
                    <div className="p-2 bg-white rounded border border-[#DDD] flex items-center justify-between">
                      <span>Internet_Explorer_6.exe</span>
                      <span className="text-neutral-400 text-[11px]">1,337 KB</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
            )}

            {/* Resize Grip (only when not maximized) */}
            {!win.isMaximized && (
              <div
                onMouseDown={(e) => startWindowResize(win.id, e)}
                className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize flex items-end justify-end p-0.5 z-30 select-none"
                title="Resize window"
              >
                <div className="w-2.5 h-2.5 border-r-2 border-b-2 border-neutral-500"></div>
              </div>
            )}
          </div>
        );
      })}

      {/* Desktop Context Menu */}
      {contextMenu && (
        <div
          onClick={(e) => e.stopPropagation()}
          className="absolute bg-[#ECE9D8] border border-[#7F9DB9] shadow-xl py-1 w-44 rounded-sm text-xs z-50 font-sans"
          style={{ left: contextMenu.x, top: contextMenu.y }}
        >
          {contextMenu.type === "desktop" ? (
            <>
              <button
                onClick={() => {
                  setIcons(initialDesktopIcons);
                  setContextMenu(null);
                }}
                className="w-full text-left px-3 py-1 hover:bg-[#3169c6] hover:text-white transition-colors"
              >
                Auto Arrange Icons
              </button>
              <button
                onClick={() => {
                  playStartupSound();
                  setContextMenu(null);
                }}
                className="w-full text-left px-3 py-1 hover:bg-[#3169c6] hover:text-white transition-colors"
              >
                Refresh
              </button>
              <div className="border-t border-[#C0B9A8] my-1" />
              <button
                onClick={() => {
                  setShowTurnOffDialog(true);
                  setContextMenu(null);
                }}
                className="w-full text-left px-3 py-1 hover:bg-[#3169c6] hover:text-white transition-colors text-red-700"
              >
                Turn Off Computer...
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => {
                  const item = icons.find((i) => i.id === contextMenu.targetId);
                  if (item) openApp(item);
                  setContextMenu(null);
                }}
                className="w-full text-left px-3 py-1 font-bold hover:bg-[#3169c6] hover:text-white transition-colors"
              >
                Open
              </button>
              <div className="border-t border-[#C0B9A8] my-1" />
              <button
                onClick={() => {
                  alert(`Properties of ${contextMenu.targetId}`);
                  setContextMenu(null);
                }}
                className="w-full text-left px-3 py-1 hover:bg-[#3169c6] hover:text-white transition-colors"
              >
                Properties
              </button>
            </>
          )}
        </div>
      )}

      {/* Start Menu Popup */}
      {startMenuOpen && (
        <div
          onClick={(e) => e.stopPropagation()}
          className="absolute bottom-9 left-0 w-80 bg-white rounded-t-lg shadow-2xl border-2 border-[#0055ea] overflow-hidden z-50 flex flex-col font-sans"
        >
          {/* Header Banner with Profile */}
          <div className="h-16 bg-gradient-to-r from-[#175cd3] to-[#388bfd] px-3 flex items-center gap-3 border-b border-[#0041b3]">
            <img
              src={pointing}
              alt="User profile"
              className="w-11 h-11 rounded-sm object-cover border-2 border-white shadow-md"
            />
            <span className="text-white font-bold text-base tracking-wide drop-shadow-md">Shivam</span>
          </div>

          {/* Two-Column Start Menu Content */}
          <div className="flex bg-[#D3E5FA] p-1.5 gap-1.5 min-h-[260px]">
            {/* Left Column: Programs */}
            <div className="flex-1 bg-white rounded p-1 space-y-0.5 border border-[#96BEE6]">
              {icons.slice(0, 5).map((icon) => (
                <button
                  key={icon.id}
                  onClick={() => openApp(icon)}
                  className="w-full flex items-center gap-2.5 px-2 py-1.5 rounded hover:bg-[#3169c6] hover:text-white text-xs font-semibold text-[#222] transition-colors text-left"
                >
                  <img src={icon.icon} alt="" className="w-6 h-6 shrink-0" />
                  <span className="truncate">{icon.label}</span>
                </button>
              ))}
            </div>

            {/* Right Column: Shortcuts */}
            <div className="w-32 bg-[#D3E5FA] p-1 flex flex-col gap-1 text-[11px] font-semibold text-[#002f87]">
              <button
                onClick={() => openApp(icons[0])}
                className="p-1 rounded hover:bg-[#c0daf7] text-left truncate"
              >
                My Documents
              </button>
              <button
                onClick={() => openApp(icons[1])}
                className="p-1 rounded hover:bg-[#c0daf7] text-left truncate"
              >
                My Computer
              </button>
              <button
                onClick={() => openApp(icons[4])}
                className="p-1 rounded hover:bg-[#c0daf7] text-left truncate"
              >
                My Music
              </button>
              <div className="border-t border-[#96BEE6] my-1" />
              <button
                onClick={() => {
                  playStartupSound();
                  setStartMenuOpen(false);
                }}
                className="p-1 rounded hover:bg-[#c0daf7] text-left truncate"
              >
                Control Panel
              </button>
              <button
                onClick={() => navigate("/")}
                className="p-1 rounded hover:bg-[#c0daf7] text-left text-[#b52b27] font-bold mt-auto"
              >
                Portfolio Home
              </button>
            </div>
          </div>

          {/* Bottom Bar: Log Off & Turn Off */}
          <div className="h-10 bg-gradient-to-r from-[#175cd3] to-[#388bfd] px-3 flex items-center justify-between text-white text-xs font-bold border-t border-[#0041b3]">
            <button
              onClick={() => {
                setStartMenuOpen(false);
                navigate("/");
              }}
              className="flex items-center gap-1.5 hover:brightness-110 active:scale-95 cursor-pointer"
            >
              <div className="w-5 h-5 rounded bg-[#e8a317] flex items-center justify-center shadow-sm">
                <svg className="w-3 h-3 text-white" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M11 1a2 2 0 00-2 2v2H2v6h2v-2h2v2h2v-2h1v3h2v-3h1v3h2V5a4 4 0 00-4-4zm0 2a1 1 0 110 2 1 1 0 010-2z" />
                </svg>
              </div>
              <span>Log Off</span>
            </button>
            <button
              onClick={() => {
                setStartMenuOpen(false);
                setShowTurnOffDialog(true);
              }}
              className="flex items-center gap-1.5 hover:brightness-110 active:scale-95 cursor-pointer"
            >
              <div className="w-5 h-5 rounded bg-[#d9534f] flex items-center justify-center shadow-sm">
                <svg className="w-3 h-3 text-white" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M7 1h2v6H7V1zm4.7 1.8l-1.4 1.4A4.95 4.95 0 0113 7c0 2.8-2.2 5-5 5s-5-2.2-5-5c0-1.4.6-2.7 1.6-3.6L3.2 2C1.9 3.2 1 5 1 7c0 3.9 3.1 7 7 7s7-3.1 7-7c0-2-.9-3.8-2.3-5.2z" />
                </svg>
              </div>
              <span>Turn Off Computer</span>
            </button>
          </div>
        </div>
      )}

      {/* Classic Windows XP "Turn off computer" Modal Dialog */}
      {showTurnOffDialog && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40"
          onClick={() => setShowTurnOffDialog(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-[370px] bg-[#003399] rounded-lg shadow-2xl border-2 border-[#0055ea] overflow-hidden text-white font-sans"
          >
            {/* Header */}
            <div className="h-12 bg-gradient-to-r from-[#003399] to-[#0055ea] px-4 flex items-center justify-between border-b border-[#002266]">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 flex items-center justify-center shrink-0">
                  <svg viewBox="0 0 32 32" className="w-4 h-4 drop-shadow">
                    <path fill="#f25022" d="M1 1h14v14H1z"/>
                    <path fill="#7fba00" d="M17 1h14v14H17z"/>
                    <path fill="#00a4ef" d="M1 17h14v14H1z"/>
                    <path fill="#ffb900" d="M17 17h14v14H17z"/>
                  </svg>
                </div>
                <span className="font-bold text-sm">Turn off computer</span>
              </div>
              <span className="font-['Clash_Display',sans-serif] text-xs font-bold italic tracking-wider text-[#8eb9f5]">
                Windows<sup className="text-[9px]">XP</sup>
              </span>
            </div>

            {/* Action Buttons: Stand By, Turn Off, Restart */}
            <div className="bg-[#00287a] py-6 px-6 flex items-center justify-around">
              {/* Stand By */}
              <button
                onClick={() => {
                  setShowTurnOffDialog(false);
                  alert("Stand By mode entered. Click anywhere to resume.");
                }}
                className="flex flex-col items-center gap-2 group cursor-pointer"
              >
                <div className="w-10 h-10 rounded-full bg-gradient-to-b from-[#fcd34d] to-[#d97706] border-2 border-white flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
                  <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12.3 2a10 10 0 0 0-.19 14 9.92 9.92 0 0 0 7.9 3.82 10.1 10.1 0 0 0 1.94-.19 10.05 10.05 0 0 1-9.65-17.63z" />
                  </svg>
                </div>
                <span className="text-xs font-semibold group-hover:underline">Stand By</span>
              </button>

              {/* Turn Off */}
              <button
                onClick={executeShutdown}
                className="flex flex-col items-center gap-2 group cursor-pointer"
              >
                <div className="w-10 h-10 rounded-full bg-gradient-to-b from-[#ef4444] to-[#b91c1c] border-2 border-white flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform animate-pulse">
                  <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M11 2h2v10h-2V2zm6.36 2.64l-1.42 1.42A7.92 7.92 0 0 1 20 12a8 8 0 1 1-16 0c0-2.45 1.1-4.64 2.84-6.14L5.42 4.44A9.95 9.95 0 0 0 2 12a10 10 0 1 0 20 0c0-3.04-1.37-5.76-3.52-7.56z" />
                  </svg>
                </div>
                <span className="text-xs font-bold text-red-200 group-hover:underline">Turn Off</span>
              </button>

              {/* Restart */}
              <button
                onClick={() => {
                  setShowTurnOffDialog(false);
                  setStartupStage("video");
                }}
                className="flex flex-col items-center gap-2 group cursor-pointer"
              >
                <div className="w-10 h-10 rounded-full bg-gradient-to-b from-[#22c55e] to-[#15803d] border-2 border-white flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
                  <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                    <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l6.73-5.19" />
                  </svg>
                </div>
                <span className="text-xs font-semibold group-hover:underline">Restart</span>
              </button>
            </div>

            {/* Footer with Cancel */}
            <div className="h-10 bg-[#001f66] px-4 flex items-center justify-end border-t border-[#00174d]">
              <button
                onClick={() => setShowTurnOffDialog(false)}
                className="px-4 py-1 rounded bg-[#ece9d8] hover:bg-white text-black text-xs font-semibold border border-[#7f9db9] shadow-sm active:translate-y-0.5"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Volume Control Popup */}
      {volumeSliderOpen && (
        <div
          onClick={(e) => e.stopPropagation()}
          className="absolute bottom-10 right-2 w-20 bg-[#ECE9D8] border border-[#7F9DB9] rounded shadow-xl p-2 flex flex-col items-center gap-2 z-50 text-xs font-sans"
        >
          <span className="text-[10px] font-bold text-neutral-600">Volume</span>
          <input
            type="range"
            min={0}
            max={100}
            value={volume}
            onChange={(e) => setVolume(Number(e.target.value))}
            className="h-24 [writing-mode:bt-lr] accent-[#245edb] cursor-pointer"
          />
          <span className="text-[10px] font-mono text-neutral-500">{volume}%</span>
        </div>
      )}

      {/* Windows XP Taskbar */}
      <div
        className="absolute bottom-0 left-0 right-0 h-9 bg-gradient-to-b from-[#245edb] via-[#3f8cf3] to-[#245edb] border-t border-[#003da6] flex items-center justify-between px-1 z-40 select-none shadow-md"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Left Side: Start Button and Active Window Tabs */}
        <div className="flex items-center gap-1.5 h-full py-0.5">
          {/* Start Button */}
          <button
            onClick={() => setStartMenuOpen((prev) => !prev)}
            className={`h-full px-3 rounded-r-lg bg-gradient-to-b from-[#388e3c] via-[#4caf50] to-[#2e7d32] hover:brightness-110 active:brightness-95 border-r border-[#1b5e20] text-white text-xs font-black italic flex items-center gap-1.5 shadow-md cursor-pointer ${
              startMenuOpen ? "brightness-90 shadow-inner" : ""
            }`}
          >
            {/* Authentic Windows XP 4-Color Flag Logo */}
            <div className="w-4 h-4 flex items-center justify-center shrink-0 drop-shadow">
              <svg viewBox="0 0 32 32" className="w-3.5 h-3.5">
                <path fill="#f25022" d="M1 1h14v14H1z"/>
                <path fill="#7fba00" d="M17 1h14v14H17z"/>
                <path fill="#00a4ef" d="M1 17h14v14H1z"/>
                <path fill="#ffb900" d="M17 17h14v14H17z"/>
              </svg>
            </div>
            <span>start</span>
          </button>

          {/* Running window tabs in taskbar */}
          <div className="flex items-center gap-1 overflow-x-auto max-w-[65vw]">
            {Object.values(openWindows).map((win) => {
              const isActive = activeWindowId === win.id && !win.isMinimized;
              return (
                <button
                  key={win.id}
                  onClick={() => {
                    if (isActive) {
                      minimizeWindow(win.id);
                    } else {
                      focusWindow(win.id);
                    }
                  }}
                  className={`h-7 max-w-[145px] px-2 rounded-[3px] border text-xs font-semibold flex items-center gap-1.5 truncate shadow-inner ${
                    isActive
                      ? "bg-[#1f4fac] border-[#0c2f78] text-white"
                      : "bg-[#3d83ee]/85 border-[#1f5ec2] text-white/95 hover:bg-[#3d83ee]"
                  }`}
                >
                  <img src={win.icon} alt="" className="w-3.5 h-3.5 shrink-0 pointer-events-none" />
                  <span className="truncate text-[11px]">{win.title}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Side: System Tray with Volume & Live Clock */}
        <div className="h-7 px-2.5 bg-[#0c59cc] border border-[#083e91] rounded-sm flex items-center gap-2.5 text-white text-xs font-semibold shadow-inner">
          <button
            onClick={() => setVolumeSliderOpen((prev) => !prev)}
            className="hover:scale-110 transition-transform cursor-pointer flex items-center text-white/90"
            title={`Volume: ${volume}%`}
          >
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
            </svg>
          </button>
          <span
            className="text-[11px] font-medium tracking-tight cursor-default"
            title={new Date().toLocaleDateString(undefined, {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          >
            {time}
          </span>
        </div>
      </div>
    </div>
  );
}
