import { useRef, useState } from "react";
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
import PopOutTransition from "./PopOutTransition";

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
    <div className="relative w-full bg-[#FFFFF] text-[#151515] font-sans">
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

          <PopOutTransition
            to="/window"
            className="z-10 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-[38%] w-[160px] h-[210px] md:w-[220px] md:h-[290px] bg-[#151515]"
          >
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