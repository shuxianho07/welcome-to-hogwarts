import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { FaExternalLinkAlt, FaGithub } from 'react-icons/fa';

export default function ProjectCard({ title, role, summary, impact, bullets, tags, github, demo, delay }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const details = impact ?? bullets ?? [];

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay: delay / 1000, ease: "easeOut" }}
      className="relative flex h-full flex-col p-8 bg-hogwarts-castle border border-hogwarts-gold/30 rounded-sm hover:border-hogwarts-gold hover:shadow-[0_0_30px_rgba(var(--hogwarts-gold-rgb),0.15)] transition-all duration-500 group"
    >
      {/* Decorative Corner Accents */}
      <div className="absolute top-0 left-0 w-4 h-4 border-t border-l border-hogwarts-gold/60 rounded-tl-sm opacity-0 group-hover:opacity-100 transition-opacity"></div>
      <div className="absolute top-0 right-0 w-4 h-4 border-t border-r border-hogwarts-gold/60 rounded-tr-sm opacity-0 group-hover:opacity-100 transition-opacity"></div>
      <div className="absolute bottom-0 left-0 w-4 h-4 border-b border-l border-hogwarts-gold/60 rounded-bl-sm opacity-0 group-hover:opacity-100 transition-opacity"></div>
      <div className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-hogwarts-gold/60 rounded-br-sm opacity-0 group-hover:opacity-100 transition-opacity"></div>

      <div className="flex-1 relative z-10">
        {role ? (
          <p className="mb-3 text-xs font-['Cinzel'] font-bold uppercase tracking-[0.2em] text-hogwarts-gold">
            {role}
          </p>
        ) : null}
        <h3 className="text-3xl font-['Cinzel'] font-bold text-hogwarts-parchment mb-4 drop-shadow-md">{title}</h3>
        
        {summary ? (
          <p className="text-base leading-relaxed text-hogwarts-parchment/80 font-['Outfit'] italic mb-6">
            "{summary}"
          </p>
        ) : null}
        
        {/* Subtle divider */}
        <div className="w-12 h-[1px] bg-hogwarts-gold/40 mb-6"></div>

        {details.length ? (
          <ul className="space-y-4 text-sm leading-relaxed text-hogwarts-parchment/85 font-['Outfit']">
            {details.map((detail) => (
              <li key={detail} className="flex gap-4 items-start">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-hogwarts-gold animate-pulse shadow-[0_0_8px_rgba(var(--hogwarts-gold-rgb),0.8)]" aria-hidden="true" />
                <span>{detail}</span>
              </li>
            ))}
          </ul>
        ) : null}
      </div>

      <div className="mt-8 flex flex-wrap gap-3 relative z-10">
        {tags.map((tag) => (
          <span
            key={tag}
            className="px-3 py-1 border border-hogwarts-gold/30 text-[10px] font-['Cinzel'] uppercase tracking-widest text-hogwarts-gold rounded-sm bg-hogwarts-gold/5"
          >
            {tag}
          </span>
        ))}
      </div>

      <div className="mt-8 flex flex-wrap gap-4 relative z-10 font-['Cinzel']">
        {demo ? (
          <a
            href={demo}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center gap-2 px-6 py-2.5 text-xs font-bold uppercase tracking-widest text-hogwarts-bg bg-hogwarts-gold hover:opacity-80 shadow-[0_0_15px_rgba(var(--hogwarts-gold-rgb),0.3)] hover:shadow-[0_0_25px_rgba(var(--hogwarts-gold-rgb),0.6)] transition-all rounded-sm hover:-translate-y-0.5"
          >
            <FaExternalLinkAlt className="h-3 w-3" />
            Live Demo
          </a>
        ) : null}
        {github ? (
          <a
            href={github}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center gap-2 px-6 py-2.5 text-xs font-bold uppercase tracking-widest text-hogwarts-gold border border-hogwarts-gold bg-transparent hover:bg-hogwarts-gold/10 transition-all rounded-sm hover:-translate-y-0.5"
          >
            <FaGithub className="h-3 w-3" />
            Repository
          </a>
        ) : null}
      </div>
    </motion.div>
  );
}
