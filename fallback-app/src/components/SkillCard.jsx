import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaChevronDown } from 'react-icons/fa';

export default function SkillCard({ title, description, items }) {
  const [expanded, setExpanded] = useState(false);
  const [activeItem, setActiveItem] = useState(null);

  const toggleItem = (itemName) => {
    setActiveItem((prev) => (prev === itemName ? null : itemName));
  };

  const toggleExpanded = () => {
    setExpanded((prev) => !prev);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      className="w-full relative border-t border-hogwarts-gold/40 pt-8 pb-12"
    >
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-[3px] bg-hogwarts-gold"></div>
      
      <button
        type="button"
        className="flex w-full cursor-pointer items-start justify-between gap-4 bg-transparent p-0 text-left focus:outline-none group"
        onClick={toggleExpanded}
        aria-expanded={expanded}
      >
        <div>
          <h3 className="mb-2 text-2xl font-['Cinzel'] font-bold text-hogwarts-parchment drop-shadow-md group-hover:text-hogwarts-gold transition-colors">{title}</h3>
          <p className="text-sm leading-relaxed text-hogwarts-parchment/70 font-['Outfit'] italic">{description}</p>
        </div>
        <div
          aria-hidden="true"
          className={`text-hogwarts-gold transition-transform duration-300 mt-2 ${
            expanded ? 'rotate-180' : 'rotate-0'
          }`}
        >
          <FaChevronDown />
        </div>
      </button>

      <div className="mt-6 flex flex-wrap gap-3">
        {items.map((item) => (
          <span
            key={item.name}
            className="px-4 py-1.5 border border-hogwarts-gold/30 text-xs font-['Cinzel'] uppercase tracking-widest text-hogwarts-gold bg-hogwarts-gold/5 rounded-sm"
          >
            {item.name}
          </span>
        ))}
      </div>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-8 overflow-hidden"
          >
            <ul className="space-y-4">
              {items.map((item) => {
                const isActive = activeItem === item.name;

                return (
                  <li key={item.name} className="border border-hogwarts-gold/20 bg-hogwarts-castle rounded-sm overflow-hidden transition-all hover:border-hogwarts-gold/50">
                    <button
                      type="button"
                      onClick={() => toggleItem(item.name)}
                      className="flex w-full items-center justify-between gap-3 px-6 py-4 text-left text-sm font-['Cinzel'] font-bold text-hogwarts-parchment hover:bg-hogwarts-gold/10 transition-colors"
                    >
                      <span className="tracking-wider">{item.name}</span>
                      <span
                        className={`text-hogwarts-gold transition-transform duration-200 ${
                          isActive ? 'rotate-180' : 'rotate-0'
                        }`}
                      >
                        <FaChevronDown className="h-3 w-3" />
                      </span>
                    </button>

                    <AnimatePresence>
                      {isActive && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="px-6 pb-6 text-sm leading-relaxed text-hogwarts-parchment/80 font-['Outfit'] border-t border-hogwarts-gold/10"
                        >
                          <div className="pt-4">
                            {item.description}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </li>
                );
              })}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
