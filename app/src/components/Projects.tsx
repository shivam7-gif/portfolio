import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";

interface Project {
  title: string;
  image: string;
}

interface ProjectsProps {
  projects: Project[];
}

const Projects = ({ projects }: ProjectsProps) => {
  return (
    <section id="projects" className="px-6 md:px-10 py-16">
      <Reveal>
        <SectionHeading className="mb-10">Projects.</SectionHeading>
      </Reveal>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {projects.map((project) => (
          <Reveal key={project.title} threshold={0.3}>
            <div className="group relative h-[320px] md:h-[420px] rounded-3xl overflow-hidden">
              <img
                src={project.image}
                alt={project.title}
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-500 flex items-end p-6">
                <span className="text-white font-bold text-xl opacity-0 group-hover:opacity-100 translate-y-3 group-hover:translate-y-0 transition-all duration-500">
                  {project.title}
                </span>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
};

export default Projects;
