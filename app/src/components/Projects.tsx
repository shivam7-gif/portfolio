import { useEffect, useRef, useState } from "react";
import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";

interface Project {
  title: string;
  image: string; // cover shown on the card
  images?: string[]; // shown in the popup (first two are used)
  tagline?: string;
  description?: string;
  tags?: string[];
  demo?: string;
  repo?: string;
}

interface ProjectsProps {
  projects: Project[];
}

// ---------------------------------------------------------------------------
// Popup
// ---------------------------------------------------------------------------
const ProjectModal = ({
  project,
  onClose,
}: {
  project: Project;
  onClose: () => void;
}) => {
  const [shown, setShown] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);

  // fade/scale in on the next frame
  useEffect(() => {
    const id = requestAnimationFrame(() => setShown(true));
    return () => cancelAnimationFrame(id);
  }, []);

  // Esc to close, lock page scroll, focus the close button
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [onClose]);

  const pics = (project.images?.length ? project.images : [project.image]).slice(0, 2);

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 bg-black/60 transition-opacity duration-300 motion-reduce:transition-none ${
        shown ? "opacity-100" : "opacity-0"
      }`}
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={project.title}
        onClick={(e) => e.stopPropagation()}
        className={`relative w-full max-w-5xl max-h-[90vh] overflow-y-auto rounded-3xl bg-[#F5F1EC] text-[#151515] p-5 md:p-8 transition-all duration-300 ease-out motion-reduce:transition-none ${
          shown ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-95 translate-y-4"
        }`}
      >
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          aria-label="Close project details"
          className="absolute top-4 right-4 w-10 h-10 rounded-full bg-[#151515] text-white text-xl leading-none flex items-center justify-center hover:opacity-80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
        >
          &times;
        </button>

        <div className={`grid gap-3 mt-10 md:mt-8 ${pics.length > 1 ? "md:grid-cols-2" : ""}`}>
          {pics.map((src, i) => (
            <img
              key={i}
              src={src}
              alt={`${project.title} screenshot ${i + 1}`}
              className="w-full h-[220px] md:h-[300px] object-cover rounded-2xl"
            />
          ))}
        </div>

        <div className="mt-6 grid gap-6 md:grid-cols-[1.4fr_1fr] md:gap-10">
          <div>
            <h3 className="font-['Clash_Display'] font-black uppercase text-3xl md:text-5xl leading-none tracking-tight">
              {project.title}
            </h3>
            {project.tagline && (
              <p className="mt-3 text-lg md:text-xl font-bold">{project.tagline}</p>
            )}
            {project.description && (
              <p className="mt-3 text-base md:text-lg leading-snug max-w-[60ch]">
                {project.description}
              </p>
            )}
          </div>

          <div className="space-y-5">
            {project.tags && project.tags.length > 0 && (
              <ul className="flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <li
                    key={tag}
                    className="rounded-full border-2 border-[#151515] px-3 py-1 text-sm font-bold"
                  >
                    {tag}
                  </li>
                ))}
              </ul>
            )}
            {(project.demo || project.repo) && (
              <div className="flex gap-3">
                {project.demo && (
                  <a
                    href={project.demo}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-full bg-[#151515] text-white px-5 py-2 font-bold hover:opacity-80"
                  >
                    Live demo
                  </a>
                )}
                {project.repo && (
                  <a
                    href={project.repo}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-full border-2 border-[#151515] px-5 py-2 font-bold hover:bg-[#151515] hover:text-white transition-colors"
                  >
                    GitHub
                  </a>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// ---------------------------------------------------------------------------
// Projects grid
// ---------------------------------------------------------------------------
const Projects = ({ projects }: ProjectsProps) => {
  const [active, setActive] = useState<Project | null>(null);

  return (
    <section id="projects" className="px-6 md:px-10 py-16">
      <Reveal>
        <SectionHeading className="mb-6">Projects.</SectionHeading>
      </Reveal>
      <p className="text-xl md:text-2xl leading-snug max-w-[38ch] mb-10">
        Two live AI products I designed, built and deployed. Click one for
        screenshots and details.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-10">
        {projects.map((project) => (
          <Reveal key={project.title} threshold={0.3}>
            <button
              type="button"
              onClick={() => setActive(project)}
              aria-haspopup="dialog"
              className="group block w-full text-left cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 rounded-3xl"
            >
              <div className="relative h-[320px] md:h-[420px] rounded-3xl overflow-hidden">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-500 flex items-end p-6">
                  <span className="text-white font-bold text-lg opacity-0 group-hover:opacity-100 translate-y-3 group-hover:translate-y-0 transition-all duration-500">
                    View details
                  </span>
                </div>
              </div>
              <div className="mt-4">
                <h3 className="font-bold text-xl md:text-2xl">{project.title}</h3>
                {project.tagline && (
                  <p className="text-base md:text-lg leading-snug">{project.tagline}</p>
                )}
              </div>
            </button>
          </Reveal>
        ))}
      </div>

      {active && <ProjectModal project={active} onClose={() => setActive(null)} />}
    </section>
  );
};

export default Projects;