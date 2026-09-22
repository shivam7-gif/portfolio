import React from "react";

interface XPWindowProps {
  title: string;
  icon?: string;
  onClose: () => void;
  children?: React.ReactNode;
}

const XPWindow = ({ title, icon, onClose, children }: XPWindowProps) => {
  return (
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[380px] md:w-[520px] h-[300px] md:h-[400px] rounded-t-lg overflow-hidden shadow-2xl border border-[#1b4fa0]">
      <div className="h-9 flex items-center justify-between px-2 bg-gradient-to-b from-[#3d95f5] via-[#1c62d6] to-[#1149b3]">
        <div className="flex items-center gap-2 text-white text-sm font-bold drop-shadow-sm">
          {icon && <img src={icon} alt="" className="w-4 h-4" />}
          {title}
        </div>
        <div className="flex items-center gap-1">
          <button
            aria-label="Minimize"
            className="w-5 h-5 rounded-[3px] bg-gradient-to-b from-[#5f9df7] to-[#2f6fd6] border border-[#1149b3] text-white flex items-center justify-center hover:brightness-110 shadow-inner cursor-pointer"
          >
            <svg className="w-2 h-2 pointer-events-none" viewBox="0 0 10 10" fill="none">
              <line x1="1" y1="8" x2="9" y2="8" stroke="white" strokeWidth="2" strokeLinecap="square" />
            </svg>
          </button>
          <button
            aria-label="Maximize"
            className="w-5 h-5 rounded-[3px] bg-gradient-to-b from-[#5f9df7] to-[#2f6fd6] border border-[#1149b3] text-white flex items-center justify-center hover:brightness-110 shadow-inner cursor-pointer"
          >
            <svg className="w-2.5 h-2.5 pointer-events-none" viewBox="0 0 10 10" fill="none">
              <rect x="1.5" y="1.5" width="7" height="7" stroke="white" strokeWidth="1.4" />
            </svg>
          </button>
          <button
            aria-label="Close"
            onClick={onClose}
            className="w-5 h-5 rounded-[3px] bg-gradient-to-b from-[#f77b6e] to-[#c23b2c] border border-[#8c2318] text-white flex items-center justify-center hover:brightness-110 shadow-inner cursor-pointer"
          >
            <svg className="w-2.5 h-2.5 pointer-events-none" viewBox="0 0 10 10" fill="none">
              <path d="M2 2L8 8M8 2L2 8" stroke="white" strokeWidth="1.8" strokeLinecap="square" />
            </svg>
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

export default XPWindow;