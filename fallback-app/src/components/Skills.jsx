import { skillCategories } from '../data/skills';
import SkillCard from './SkillCard';

export default function Skills() {
  return (
    <section className="space-y-12 max-w-4xl mx-auto pt-10">
      <div className="text-center flex flex-col items-center">
        <div className="flex items-center gap-4 mb-4 w-full justify-center">
          <div className="h-[1px] w-12 bg-hogwarts-gold/50"></div>
          <p className="text-sm font-['Cinzel'] font-bold uppercase tracking-[0.3em] text-hogwarts-gold">
            Technical Stack
          </p>
          <div className="h-[1px] w-12 bg-hogwarts-gold/50"></div>
        </div>
        <h2 className="text-5xl md:text-6xl font-['Cinzel'] font-bold tracking-tight text-hogwarts-parchment drop-shadow-md">
          The Arcane Arts
        </h2>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-hogwarts-parchment/80 font-['Outfit'] italic">
          A snapshot of my strongest technical frameworks and tools, available for rapid inspection. Expand any category for detailed application contexts.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 pt-10">
        {skillCategories.map((category) => (
          <SkillCard
            key={category.title}
            title={category.title}
            description={category.description}
            items={category.items}
          />
        ))}
      </div>
    </section>
  );
}
