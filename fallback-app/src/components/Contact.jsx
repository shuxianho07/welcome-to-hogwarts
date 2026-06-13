import { FaEnvelope, FaGithub, FaLinkedin, FaMapMarkerAlt, FaRegClock } from 'react-icons/fa';

const contactItems = [
  {
    label: 'Send an Owl (Email)',
    value: 's39ho@uwaterloo.ca',
    href: 'mailto:s39ho@uwaterloo.ca',
    icon: FaEnvelope,
  },
  {
    label: 'The Archives (GitHub)',
    value: 'github.com/shuxianho07',
    href: 'https://github.com/shuxianho07',
    icon: FaGithub,
  },
  {
    label: 'Professional Network (LinkedIn)',
    value: 'linkedin.com/in/shuxian-susan-ho',
    href: 'https://www.linkedin.com/in/shuxian-susan-ho/',
    icon: FaLinkedin,
  },
  {
    label: 'Current Realm',
    value: 'Waterloo / Toronto, ON',
    icon: FaMapMarkerAlt,
  },
  {
    label: 'Quest Board',
    value: 'Open to backend, AI infrastructure, data science, quant tooling, and full-stack roles',
    icon: FaRegClock,
  }
];

export default function Contact() {
  return (
    <section id="contact" className="relative scroll-mt-24 py-16">
      <div className="mx-auto max-w-4xl text-center flex flex-col items-center">
        <div className="flex items-center gap-4 mb-4 w-full justify-center">
          <div className="h-[1px] w-12 bg-hogwarts-gold/50"></div>
          <p className="text-sm font-['Cinzel'] font-bold uppercase tracking-[0.3em] text-hogwarts-gold">
            Dispatch a Message
          </p>
          <div className="h-[1px] w-12 bg-hogwarts-gold/50"></div>
        </div>
        
        <h2 className="text-5xl md:text-6xl font-['Cinzel'] font-bold tracking-tight text-hogwarts-parchment drop-shadow-md mb-6">
          Contact Me
        </h2>
        
        <p className="mt-2 text-lg leading-relaxed text-hogwarts-parchment/80 font-['Outfit'] italic max-w-2xl">
          The best path for recruiters: dispatch an owl (email) first, then peruse the archives (GitHub) for context on my technical spells.
        </p>

        <div className="mt-16 w-full flex flex-col gap-6">
          {contactItems.map((item) => {
            const Icon = item.icon;
            const isLink = Boolean(item.href);

            return (
              <div
                key={item.label}
                className="group flex flex-col md:flex-row items-center justify-between gap-6 p-6 border border-hogwarts-gold/30 bg-hogwarts-castle rounded-sm transition-all hover:border-hogwarts-gold hover:shadow-[0_0_20px_rgba(var(--hogwarts-gold-rgb),0.15)] w-full text-center md:text-left"
              >
                <div className="flex items-center gap-6 flex-col md:flex-row">
                  <div
                    className="flex h-16 w-16 items-center justify-center rounded-full border border-hogwarts-gold/40 bg-hogwarts-gold/5 text-hogwarts-gold shadow-[0_0_15px_rgba(var(--hogwarts-gold-rgb),0.1)] group-hover:bg-hogwarts-gold/20 group-hover:scale-110 transition-all duration-500"
                    aria-hidden="true"
                  >
                    <Icon className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-lg font-['Cinzel'] font-bold text-hogwarts-parchment drop-shadow-sm">{item.label}</p>
                    {isLink ? (
                      <a
                        href={item.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-1 inline-block text-sm text-hogwarts-parchment/70 transition-colors font-['Outfit'] hover:text-hogwarts-gold"
                      >
                        {item.value}
                      </a>
                    ) : (
                      <p className="mt-1 text-sm text-hogwarts-parchment/70 font-['Outfit']">{item.value}</p>
                    )}
                  </div>
                </div>
                
                {isLink && (
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="shrink-0 px-6 py-2.5 text-xs font-['Cinzel'] font-bold uppercase tracking-widest text-hogwarts-bg bg-hogwarts-gold hover:opacity-80 shadow-[0_0_10px_rgba(var(--hogwarts-gold-rgb),0.3)] transition-all rounded-sm hidden md:block"
                  >
                    Connect
                  </a>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
