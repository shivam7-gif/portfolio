import { useState } from "react";

const menuItems = ["About Me", "Services", "Projects", "Contact"];

const Navbar = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className="w-full flex justify-center pt-6">
      <style>{`
        @keyframes wipeReveal {
          0% {
            clip-path: inset(0 100% 0 0);
          }
          100% {
            clip-path: inset(0 0% 0 0);
          }
        }
        .menu-item-anim {
          animation-name: wipeReveal;
          animation-duration: 0.5s;
          animation-timing-function: cubic-bezier(0.65, 0, 0.35, 1);
          animation-fill-mode: both;
        }
      `}</style>

      <div
        className={`bg-[#151515] text-white rounded-[28px] w-[820px] max-w-[92vw] overflow-hidden transition-[height] duration-300 ease-out ${
          open ? "h-[300px]" : "h-[60px]"
        }`}
      >
        {/* Top row */}
        <div className="h-[60px] px-3 flex items-center justify-between">
          <span className="font-semibold text-[17px] pl-3">Shivam</span>

          <button
            onClick={() => setOpen((prev) => !prev)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            className="h-9 w-9 rounded-full bg-[#F5F1EA] text-[#151515] flex items-center justify-center hover:opacity-90 transition-opacity"
          >
            {open ? (
              <span className="text-lg leading-none">&times;</span>
            ) : (
              <span className="text-lg leading-none tracking-[2px]">&bull;&bull;&bull;</span>
            )}
          </button>
        </div>

        {/* Expandable menu — key forces remount so the animation replays every open */}
        <nav
          key={open ? "open" : "closed"}
          className={`flex flex-col gap-3 px-3 pb-3 transition-opacity duration-200 ${
            open ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        >
          {menuItems.map((item, i) => (
            <button
              key={item}
              onClick={() => setOpen(false)}
              style={open ? { animationDelay: `${i * 150}ms` } : undefined}
              className={`bg-[#F5F1EA] text-[#151515] text-left text-[15px] font-medium rounded-2xl px-5 py-3 hover:bg-white transition-colors ${
                open ? "menu-item-anim" : ""
              }`}
            >
              {item}
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default Navbar;