import Reveal from "./Reveal";

interface PhotoGridProps {
  images: string[];
}

const PhotoGrid = ({ images }: PhotoGridProps) => {
  // duplicate the list so the track can loop seamlessly with no visible jump
  const track = [...images, ...images];

  return (
    <Reveal>
      <section className="relative py-16 overflow-hidden">
        <style>{`
          @keyframes marquee {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
          .marquee-track {
            animation: marquee 30s linear infinite;
          }
          .marquee-track:hover {
            animation-play-state: paused;
          }
        `}</style>

        <div className="pointer-events-none absolute left-0 top-0 h-full w-24 md:w-40 z-10 bg-gradient-to-r from-[#F4F1EA] to-transparent" />
        <div className="pointer-events-none absolute right-0 top-0 h-full w-24 md:w-40 z-10 bg-gradient-to-l from-[#F4F1EA] to-transparent" />

        <div className="flex gap-3 w-max marquee-track">
          {track.map((src, i) => (
            <div
              key={i}
              className="w-[260px] md:w-[410px] h-[500px] md:h-[620px] rounded-[40px] overflow-hidden transition-transform duration-500 ease-out hover:-translate-y-3 hover:scale-[1.02]"
            >
              <img src={src} alt="" className="w-full h-full object-cover" />
            </div>
          ))}
        </div>
      </section>
    </Reveal>
  );
};

export default PhotoGrid;