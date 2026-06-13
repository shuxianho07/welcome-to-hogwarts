import GlassCard from './GlassCard';
import { awards } from '../data/awards';

export default function Awards() {
  return (
    <section className="space-y-8">
      <div>
        <p className="mb-3 text-xs font-['Cinzel'] font-semibold uppercase tracking-[0.2em] text-hogwarts-gold dark:text-hogwarts-gold">
          Recognition
        </p>
        <h2 className="text-3xl font-['Cinzel'] font-bold tracking-tight text-hogwarts-bg dark:text-hogwarts-parchment">
          Awards & Recognition
        </h2>
        <p className="mt-3 max-w-2xl text-base leading-7 text-hogwarts-parchment/80 dark:text-hogwarts-parchment/70">
          Highlights of notable awards and recognition received during my studies.
        </p>
      </div>

      <div className="space-y-4">
        {awards.map((award) => (
          <GlassCard key={award.text} className="p-6">
            <p className="text-hogwarts-parchment/80 dark:text-hogwarts-parchment/80">{award.text}</p>
          </GlassCard>
        ))}
      </div>
    </section>
  );
}
