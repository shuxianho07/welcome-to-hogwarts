import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { FaBars, FaFileAlt, FaMoon, FaSun, FaTimes, FaEnvelope, FaLinkedin, FaGithub } from 'react-icons/fa';

const navItems = [
  { label: 'home', to: '/' },
  { label: 'about me', to: '/about' },
  { label: 'skills', to: '/skills' },
  { label: 'projects', to: '/projects' },
  { label: 'resume', to: '/resume' },
  { label: 'contact', to: '/contact' }
];

export default function Navbar({ theme, onToggleTheme }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 w-full flex items-center justify-between px-6 lg:px-10 py-4 bg-hogwarts-bg/95 backdrop-blur-md border-b border-hogwarts-gold/20 font-['Patrick_Hand'] pointer-events-auto">
      
      {/* Back to Game Button */}
      <a href="../index.html" className="px-4 py-2 bg-white/90 dark:bg-hogwarts-gold/90 text-hogwarts-gold dark:text-hogwarts-bg font-['Cinzel'] text-sm font-semibold rounded-lg shadow-md hover:scale-105 transition-transform shrink-0">
        ⬅ Game
      </a>

      {/* Desktop Links Container */}
      <div className="hidden md:flex items-center gap-4 lg:gap-8 text-lg lg:text-xl">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `text-hogwarts-gold hover:text-white transition-colors duration-200 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] hover:drop-shadow-[0_0_10px_rgba(var(--hogwarts-gold-rgb),0.4)] ${isActive ? 'text-white drop-shadow-[0_0_10px_rgba(var(--hogwarts-gold-rgb),0.4)]' : ''}`
            }
          >
            {item.label}
          </NavLink>
        ))}
      </div>

      {/* Desktop Socials */}
      <div className="hidden md:flex gap-4 items-center">
        <button
          onClick={onToggleTheme}
          className="text-hogwarts-gold hover:text-white transition-colors duration-200 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] hover:drop-shadow-[0_0_10px_rgba(var(--hogwarts-gold-rgb),0.4)]"
          title="Toggle Light/Dark Theme"
        >
          {theme === 'dark' ? 'Lumos' : 'Nox'}
        </button>
        <a href="mailto:s39ho@uwaterloo.ca" target="_blank" rel="noreferrer" className="text-hogwarts-gold hover:text-white transition-colors duration-200 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] hover:drop-shadow-[0_0_10px_rgba(var(--hogwarts-gold-rgb),0.4)]">
          <FaEnvelope className="text-xl" />
        </a>
        <a href="https://www.linkedin.com/in/shuxian-susan-ho/" target="_blank" rel="noreferrer" className="text-hogwarts-gold hover:text-white transition-colors duration-200 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] hover:drop-shadow-[0_0_10px_rgba(var(--hogwarts-gold-rgb),0.4)]">
          <FaLinkedin className="text-xl" />
        </a>
        <a href="https://github.com/shuxianho07" target="_blank" rel="noreferrer" className="text-hogwarts-gold hover:text-white transition-colors duration-200 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] hover:drop-shadow-[0_0_10px_rgba(var(--hogwarts-gold-rgb),0.4)]">
          <FaGithub className="text-xl" />
        </a>
      </div>

      {/* Mobile Menu Toggle */}
      <div className="md:hidden flex items-center gap-4">
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="text-hogwarts-gold drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]"
        >
          {mobileOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileOpen && (
        <div className="absolute top-12 right-0 flex flex-col gap-4 p-4 bg-hogwarts-bg/95 border border-hogwarts-gold/30 rounded-xl backdrop-blur-md md:hidden min-w-[200px]">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={() => setMobileOpen(false)}
              className="text-hogwarts-gold hover:text-white"
            >
              {item.label}
            </NavLink>
          ))}
          <div className="h-[1px] bg-hogwarts-gold/20 my-2"></div>
          <button onClick={() => { onToggleTheme(); setMobileOpen(false); }} className="text-hogwarts-gold text-left">
            {theme === 'dark' ? 'Lumos' : 'Nox'}
          </button>
        </div>
      )}
    </nav>
  );
}
