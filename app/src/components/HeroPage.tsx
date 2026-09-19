import Navbar from "./Navbar";
import heroIcon from "../assets/hero_icon.png";
import CursorRandomImage from "./cursor";

// images
import img1 from "../assets/CursorImages/image1.jpg";
import img2 from "../assets/CursorImages/image2.jpg";
import img3 from "../assets/CursorImages/image3.jpg";

const photos = [img1 ,img2,img3];
const HeroPage = () => {
  return (
    <div className="relative w-full min-h-screen bg-[#F4F1EA] text-[#151515] font-sans overflow-hidden px-6 md:px-10 pt-2 pb-8">
      <Navbar />
      <CursorRandomImage images={photos}>

      <section className="relative">
        <h1 className="relative z-0 text-center top-60 font-black uppercase leading-[0.88] tracking-tight text-[15vw] md:text-[9vw] select-none">
          Software
          <br />
          Engineer
        </h1>

        <div className="z-10 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-[38%] w-[160px] h-[210px] md:w-[220px] md:h-[290px] bg-[#151515] z-10">
          <img src={heroIcon} alt="Hero portrait" className="w-full h-full object-cover" />
        </div>

        <div className="relative z-20 mt-10 flex items-end justify-between">
          <span className="font-bold text-lg md:text-2xl">&copy;2026</span>
          <div className="flex flex-col items-end gap-3"></div>
        </div>
      </section>
      </CursorRandomImage>
    </div>
  );
};

export default HeroPage;