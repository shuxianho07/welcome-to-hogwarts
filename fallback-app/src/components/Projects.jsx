import { projects } from '../data/projects';
import ProjectCard from './ProjectCard';

export default function Projects() {
  return (
    <section className="space-y-12 max-w-6xl mx-auto pt-10">
      <div className="text-center flex flex-col items-center">
        <div className="flex items-center gap-4 mb-4 w-full justify-center">
          <div className="h-[1px] w-12 bg-hogwarts-gold/50"></div>
          <p className="text-sm font-['Cinzel'] font-bold uppercase tracking-[0.3em] text-hogwarts-gold">
            My Portfolio
          </p>
          <div className="h-[1px] w-12 bg-hogwarts-gold/50"></div>
        </div>
        <h2 className="text-5xl md:text-6xl font-['Cinzel'] font-bold tracking-tight text-hogwarts-parchment drop-shadow-md">
          Projects
        </h2>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-hogwarts-parchment/80 font-['Outfit']">
          A selection of major technical achievements, systems architecture, and end-to-end data pipelines.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
        {projects.map((project, idx) => (
          <ProjectCard
            key={project.title}
            {...project}
            delay={idx * 150}
          />
        ))}
      </div>
    </section>
  );
}
