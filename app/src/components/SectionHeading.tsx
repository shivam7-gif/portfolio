interface SectionHeadingProps {
  children: React.ReactNode;
  className?: string;
}

const SectionHeading = ({ children, className = "" }: SectionHeadingProps) => {
  return (
    <h2
      className={`font-['Clash_Display'] font-black uppercase tracking-tight leading-[0.9] text-5xl md:text-7xl ${className}`}
    >
      {children}
    </h2>
  );
};

export default SectionHeading;