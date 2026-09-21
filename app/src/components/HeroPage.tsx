import { useEffect, useRef, useState } from "react";
import catWorking from "../assets/cat_section.png";
import cat from "../assets/cat.png";
import cat2 from "../assets/cat2.png";
import cat3 from "../assets/cat3.png";
import cat4 from "../assets/cat4.png";
import Navbar from "./Navbar";
import CursorRandomImage from "./cursor";
import Reveal from "./Reveal";
import PhotoGrid from "./PhotoGrid";
import Projects from "./Projects";
import SectionHeading from "./SectionHeading";

import pointing from "../assets/CursorImages/pointing.jpg";
// hover-cursor images
import img1 from "../assets/CursorImages/image1.jpg";
import img2 from "../assets/CursorImages/image2.jpg";
import img3 from "../assets/CursorImages/image3.jpg";
import img4 from "../assets/CursorImages/image4.jpg";
import img5 from "../assets/CursorImages/image5.jpg";
import img6 from "../assets/CursorImages/image6.jpg";
import img7 from "../assets/CursorImages/image7.jpg";
import img8 from "../assets/CursorImages/image8.jpeg";
import img9 from "../assets/CursorImages/image9.jpeg";

// XP assets
import bliss from "../assets/xp/bliss_wallpaper.jpg";
import bootGif from "../assets/xp/xp_boot_screen.gif";
import iconAboutMe from "../assets/xp/icons/about_me.png";
import iconProjects from "../assets/xp/icons/projects.png";
import iconContact from "../assets/xp/icons/contact.png";
import iconResume from "../assets/xp/icons/resume.png";
import iconPlaylist from "../assets/xp/icons/playlist.png";
import iconRecycleBin from "../assets/xp/icons/recycle_bin.png";

const photos = [img1, img2, img3, img4, img5, img6, img7, img8, img9];

// reuse the same set for the grid below the hero — swap in your own project shots
const gridImages = [img1, img2, img3, img4, img5, img6];
const projects = [
  { title: "Project One", image: img1 },
  { title: "Project Two", image: img2 },
];

// pool used for every click after the first "cat" pose
const catPool = [cat2, cat3, cat4];

// ---------------------------------------------------------------------------
// XPWindow — the little app window that opens when a desktop icon is opened
// ---------------------------------------------------------------------------
interface XPWindowProps {
  title: string;
  icon: string;
  onClose: () => void;
  children?: React.ReactNode;
}

const XPWindow = ({ title, icon, onClose, children }: XPWindowProps) => {
  return (
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[380px] md:w-[520px] h-[300px] md:h-[400px] rounded-t-lg overflow-hidden shadow-2xl border border-[#1b4fa0]">
      <div className="h-9 flex items-center justify-between px-2 bg-gradient-to-b from-[#3d95f5] via-[#1c62d6] to-[#1149b3]">
        <div className="flex items-center gap-2 text-white text-sm font-bold drop-shadow-sm">
          <img src={icon} alt="" className="w-4 h-4" />
          {title}
        </div>
        <div className="flex items-center gap-1">
          <button
            aria-label="Minimize"
            className="w-5 h-5 rounded-[3px] bg-gradient-to-b from-[#5f9df7] to-[#2f6fd6] border border-[#1149b3] text-white text-[10px] font-bold flex items-center justify-center hover:brightness-110"
          >
            &#95;
          </button>
          <button
            aria-label="Maximize"
            className="w-5 h-5 rounded-[3px] bg-gradient-to-b from-[#5f9df7] to-[#2f6fd6] border border-[#1149b3] text-white text-[10px] font-bold flex items-center justify-center hover:brightness-110"
          >
            &#9633;
          </button>
          <button
            aria-label="Close"
            onClick={onClose}
            className="w-5 h-5 rounded-[3px] bg-gradient-to-b from-[#f77b6e] to-[#c23b2c] border border-[#8c2318] text-white text-[10px] font-bold flex items-center justify-center hover:brightness-110"
          >
            &#10005;
          </button>
        </div>
      </div>

      <div className="h-[calc(100%-2.25rem)] bg-[#ECE9D8] p-4 overflow-auto">
        {children ?? (
          <p className="text-sm text-[#333]">This window is empty for now — content coming soon.</p>
        )}
      </div>
    </div>
  );
};

// ---------------------------------------------------------------------------
// XPBootScreen — animated boot gif shown for a fixed duration, then calls onDone
// ---------------------------------------------------------------------------
interface XPBootScreenProps {
  onDone: () => void;
  duration?: number;
}

const XPBootScreen = ({ onDone, duration = 2600 }: XPBootScreenProps) => {
  useEffect(() => {
    const timer = setTimeout(onDone, duration);
    return () => clearTimeout(timer);
  }, [onDone, duration]);

  return (
    <div className="absolute inset-0 bg-black flex items-center justify-center">
      <img src={bootGif} alt="Windows XP booting" className="w-full h-full object-cover" />
    </div>
  );
};

// ---------------------------------------------------------------------------
// XPDesktop — Bliss wallpaper, icon grid, taskbar; opens XPWindow on icon open
// ---------------------------------------------------------------------------
interface DesktopIcon {
  id: string;
  label: string;
  icon: string;
}

const desktopIcons: DesktopIcon[] = [
  { id: "about", label: "About Me", icon: iconAboutMe },
  { id: "projects", label: "My Projects", icon: iconProjects },
  { id: "contact", label: "Contact", icon: iconContact },
  { id: "resume", label: "Resume.txt", icon: iconResume },
  { id: "music", label: "Playlist", icon: iconPlaylist },
  { id: "recycle", label: "Recycle Bin", icon: iconRecycleBin },
];

interface XPDesktopProps {
  onClose: () => void;
}

const XPDesktop = ({ onClose }: XPDesktopProps) => {
  const [openWindow, setOpenWindow] = useState<DesktopIcon | null>(null);
  const [selectedIcon, setSelectedIcon] = useState<string | null>(null);
  const [time, setTime] = useState(() => new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }));

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }));
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="absolute inset-0 bg-cover bg-center select-none" style={{ backgroundImage: `url(${bliss})` }}>
      <button
        onClick={onClose}
        aria-label="Close"
        className="absolute top-3 right-3 z-30 w-7 h-7 rounded-[3px] bg-gradient-to-b from-[#f77b6e] to-[#c23b2c] border border-[#8c2318] text-white text-xs font-bold flex items-center justify-center hover:brightness-110"
      >
        &#10005;
      </button>

      <div className="absolute top-6 left-6 flex flex-col gap-6">
        {desktopIcons.map((icon) => (
          <button
            key={icon.id}
            onClick={() => setSelectedIcon(icon.id)}
            onDoubleClick={() => setOpenWindow(icon)}
            className={`w-20 flex flex-col items-center gap-1 px-1 py-1 rounded ${
              selectedIcon === icon.id ? "bg-[#3169c6]/40 outline outline-1 outline-dashed outline-white/70" : ""
            }`}
          >
            <img src={icon.icon} alt="" className="w-10 h-10 drop-shadow-md" />
            <span className="text-white text-xs font-medium text-center leading-tight [text-shadow:1px_1px_1px_rgba(0,0,0,0.8)]">
              {icon.label}
            </span>
          </button>
        ))}
      </div>

      {openWindow && (
        <XPWindow title={openWindow.label} icon={openWindow.icon} onClose={() => setOpenWindow(null)}>
          <p className="text-sm text-[#333]">
            Content for <strong>{openWindow.label}</strong> goes here — swap this placeholder for real
            About/Projects/Contact content.
          </p>
        </XPWindow>
      )}

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

// ---------------------------------------------------------------------------
// PopOutTransition — expands the clicked element to fullscreen, then plays
// the boot sequence and hands off to the XP desktop
// ---------------------------------------------------------------------------
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

// ---------------------------------------------------------------------------
// HeroPage
// ---------------------------------------------------------------------------
const HeroPage = () => {
  const [isPosing, setIsPosing] = useState(false);
  const [poseImage, setPoseImage] = useState(cat);
  const hasShownFirstPose = useRef(false);

  const toggleCat = () => {
    if (!isPosing) {
      if (!hasShownFirstPose.current) {
        setPoseImage(cat);
        hasShownFirstPose.current = true;
      } else {
        const random = catPool[Math.floor(Math.random() * catPool.length)];
        setPoseImage(random);
      }
      setIsPosing(true);
    } else {
      setIsPosing(false);
    }
  };

  return (
    <div className="relative w-full bg-[#F4F1EA] text-[#151515] font-sans">
      <img
        src={isPosing ? poseImage : catWorking}
        alt="Cat mascot — click to change pose"
        onClick={toggleCat}
        className="fixed left-0 bottom-0 z-40 w-[140px] md:w-[220px] cursor-pointer select-none"
      />

      <Navbar />

      <CursorRandomImage images={photos}>
        <section className="relative min-h-screen overflow-hidden px-6 md:px-10 pt-2 pb-8">
          <h1 className="relative z-0 text-center top-52 font-['Clash_Display'] font-black uppercase leading-[0.88] tracking-tight text-[15vw] md:text-[9vw] select-none">
            Software
            <br />
            Engineer
          </h1>

          {/* Click the portrait: expands to fullscreen -> XP boot gif -> XP desktop, all defined above */}
          <PopOutTransition className="z-10 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-[38%] w-[160px] h-[210px] md:w-[220px] md:h-[290px] bg-[#151515]">
            <img src={pointing} alt="Hero portrait" className="w-full h-full object-cover" />
          </PopOutTransition>

          <div className="relative z-20 mt-10 flex items-end justify-between">
            <span className="font-bold text-lg md:text-2xl">&copy;2026</span>
            <div className="flex flex-col items-end gap-3"></div>
          </div>
        </section>
      </CursorRandomImage>

      <PhotoGrid images={gridImages} />

      <section id="about" className="min-h-screen flex items-center px-6 md:px-10">
        <Reveal>
          <SectionHeading>About Me.</SectionHeading>
        </Reveal>
      </section>

      <Projects projects={projects} />

      <section id="contact" className="min-h-screen flex items-center px-6 md:px-10">
        <Reveal>
          <SectionHeading>Contact.</SectionHeading>
        </Reveal>
      </section>
    </div>
  );
};

export default HeroPage;