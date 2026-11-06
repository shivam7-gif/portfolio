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

import karma1 from "../assets/karma/karma-1.png";
import karma2 from "../assets/karma/karma-2.png";

import stackpilot1 from "../assets/stackpilot/stackpilot-1.png";
import stackpilot2 from "../assets/stackpilot/stackpilot-2.png"; 


const photos = [img1, img2, img3, img4, img5, img6, img7, img8, img9];

// reuse the same set for the grid below the hero — swap in your own project shots
const gridImages = [img1, img2, img3, img4, img5, img6];

const projects = [
  {
    title: "StackPilot AI",
    image: stackpilot1,
    images: [stackpilot1, stackpilot2],
    tagline: "A collaborative agentic AI IDE.",
    description:
      "Six LangGraph agents (Planner, Architect, Coder, Tester, DevOps, Reviewer) take a feature request to tested, CI/CD-deployed code. A Neo4j and Pinecone memory layer recalls past architecture decisions in under 120ms and cuts redundant LLM calls by about 40%. Developers and the agent team work in one shared workspace.",
    tags: [
      "LangGraph",
      "FastAPI",
      "Next.js",
      "Neo4j",
      "Pinecone",
      "Redis",
      "Docker",
    ],
    demo: "", // add live demo URL
    repo: "", // add GitHub repo URL
  },
  {
    title: "Karma",
    image: karma1,
    images: [karma1, karma2],
    tagline: "An AI assistant built on the Model Context Protocol.",
    description:
      "An MCP client-server assistant where the LLM discovers and orchestrates 18+ tools across code intelligence, knowledge retrieval and shopping. It inspects GitHub repos in isolated workspaces, proposes code changes as reviewable diffs that need your approval, and answers from PDFs with page-level sources through hybrid Neo4j, vector and full-text RAG.",
    tags: ["TypeScript", "Node.js", "MCP", "Neo4j", "PostgreSQL", "React"],
    demo: "", // add live demo URL
    repo: "", // add GitHub repo URL
  },
];

// pool used for every click after the first "cat" pose
const catPool = [cat2, cat3, cat4];

// hero links
const heroLinks = [
  { label: "GitHub", href: "https://github.com/shivam7-gif" },
  { label: "LinkedIn", href: "https://linkedin.com/in/shivam7-gif" },
  { label: "Email", href: "mailto:shivamsrawat7@gmail.com" },
];

// contact rows
const contactRows = [
  { label: "Phone", value: "+91-85959-30785", href: "tel:+918595930785" },
  {
    label: "LinkedIn",
    value: "linkedin.com/in/shivam7-gif",
    href: "https://linkedin.com/in/shivam7-gif",
  },
  {
    label: "GitHub",
    value: "github.com/shivam7-gif",
    href: "https://github.com/shivam7-gif",
  },
  {
    label: "Codolio",
    value: "codolio.com/profile/ShivamRawat",
    href: "https://codolio.com/profile/ShivamRawat",
  },
  { label: "Based in", value: "Delhi, India" },
];

// shared text styles so every section reads the same
const lead = "text-xl md:text-2xl leading-snug";
const body = "text-base md:text-lg leading-snug";
const linkCls =
  "underline underline-offset-4 decoration-2 hover:decoration-[#151515]/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4";

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
    <div className="relative w-full bg-[#F5F1EC] text-[#151515] font-sans">
      

      <Navbar />

      {/* ------------------------------- HERO ------------------------------- */}
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
            <img
              src={pointing}
              alt="Hero portrait"
              className="w-full h-full object-cover"
            />
          </PopOutTransition>

          {/* hero footer: left copy clears the cat, right copy lines up with the page edge */}
          <div className="absolute z-20 bottom-8 left-6 right-6 md:left-10 md:right-10 flex flex-col gap-6 md:flex-row md:items-end md:justify-between pl-[150px] md:pl-[240px]">
            <div className="max-w-md">
              <span className="block font-bold text-xl md:text-2xl mb-2">
                &copy;2026
              </span>
              <p className={lead}>
                Hi, I'm Shivam, a developer from Delhi. I build AI agents,
                MCP-powered assistants and backends that stay fast under load.
              </p>
            </div>

            <div className="md:text-right max-w-md">
              <p className={`${body} mb-3`}>
                Right now: StackPilot AI, a six-agent system that ships code,
                and Karma, an AI assistant that works across your apps.
              </p>
              <ul className="flex flex-wrap gap-x-5 gap-y-1 md:justify-end font-bold text-base md:text-lg">
                {heroLinks.map(({ label, href }) => (
                  <li key={label}>
                    <a
                      href={href}
                      target={href.startsWith("http") ? "_blank" : undefined}
                      rel="noreferrer"
                      className={linkCls}
                    >
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      </CursorRandomImage>

      <PhotoGrid images={gridImages} />

      {/* ------------------------------ ABOUT ------------------------------- */}
      <section id="about" className="bg-white">
        <div className="min-h-screen flex flex-col justify-center gap-10 px-6 md:px-10 py-24">
          <Reveal>
            <SectionHeading>About Me.</SectionHeading>
          </Reveal>

          <div className="grid items-start gap-10 md:grid-cols-[1.2fr_1fr] md:gap-20 max-w-6xl">
            <div className={`space-y-5 ${lead} max-w-[38ch]`}>
              <p>
                I'm Shivam, a second-year IT student at GTBIT in Delhi. I build
                backend and AI systems, and I ship them.
              </p>
              <p>
                StackPilot is a six-agent platform that takes a feature request
                to tested, deployed code. Karma is an assistant on the Model
                Context Protocol that works with 18+ tools. Both are live.
              </p>
              <p>I'm looking for a software development engineer internship.</p>
            </div>

            <dl
              className={`${body} divide-y divide-[#151515]/15 border-y border-[#151515]/15`}
            >
              {[
                [
                  "Competitive programming",
                  "LeetCode Knight, max rating 2002 (top 3%). Codeforces Specialist. CodeChef 3-Star.",
                ],
                [
                  "Open source",
                  "10+ merged pull requests in GSSoC 2026, AI / Agents track.",
                ],
                [
                  "Hackathons",
                  "SIH Internal Hackathon winner. TARAG finalist (2026).",
                ],
                [
                  "Works with",
                  "Python, TypeScript, FastAPI, Node.js, Next.js, LangGraph, MCP, Neo4j, Redis, Docker, AWS.",
                ],
              ].map(([term, desc]) => (
                <div key={term} className="py-4">
                  <dt className="font-bold">{term}</dt>
                  <dd>{desc}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      {/* ----------------------------- PROJECTS ----------------------------- */}
      <Projects projects={projects} />

      {/* ----------------------------- CONTACT ------------------------------ */}
      <section id="contact" className="bg-white">
        <div className="min-h-screen flex flex-col justify-center gap-10 px-6 md:px-10 py-24">
          <Reveal>
            <SectionHeading>Contact.</SectionHeading>
          </Reveal>

          <div className="grid items-start gap-10 md:grid-cols-[1.2fr_1fr] md:gap-20 max-w-6xl">
            <div className="space-y-5 max-w-[38ch]">
              <p className={lead}>
                I'm looking for a software development engineer internship.
                Email is the fastest way to reach me.
              </p>
              <a
                href="mailto:shivamsrawat7@gmail.com"
                className={`block font-['Clash_Display'] font-black text-2xl md:text-4xl break-all ${linkCls}`}
              >
                shivamsrawat7@gmail.com
              </a>
            </div>

            <dl
              className={`${body} divide-y divide-[#151515]/15 border-y border-[#151515]/15`}
            >
              {contactRows.map(({ label, value, href }) => (
                <div key={label} className="py-4">
                  <dt className="font-bold">{label}</dt>
                  <dd>
                    {href ? (
                      <a
                        href={href}
                        target={href.startsWith("http") ? "_blank" : undefined}
                        rel="noreferrer"
                        className={linkCls}
                      >
                        {value}
                      </a>
                    ) : (
                      value
                    )}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HeroPage;
