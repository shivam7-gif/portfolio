import { useState } from "react";

const menuItems = ["About Me", "Services", "Projects", "Contact"];

const Navbar = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className="w-full flex justify-center pt-6">
      <div
        className={`bg-[#151515] text-white rounded-[28px] w-[820px] max-w-[92vw] overflow-hidden transition-[height] duration-300 ease-out ${
          open ? "h-[280px]" : "h-[60px]"
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

        {/* Expandable menu */}
        <nav
          className={`flex flex-col gap-3 px-3 pb-3 transition-opacity duration-300 ${
            open ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        >
          {menuItems.map((item) => (
            <button
              key={item}
              onClick={() => setOpen(false)}
              className="bg-[#F5F1EA] text-[#151515] text-left text-[15px] font-medium rounded-2xl px-5 py-3 hover:bg-white transition-colors"
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