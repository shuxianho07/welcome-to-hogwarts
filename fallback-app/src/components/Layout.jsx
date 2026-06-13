import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import AnimatedBackground from './AnimatedBackground';

export default function Layout({ theme, onToggleTheme }) {
  return (
    <div className="site-shell relative isolate min-h-screen overflow-x-hidden text-hogwarts-parchment transition-colors duration-500">
      <AnimatedBackground />

      <div className="relative z-10 flex min-h-screen flex-col">
        <Navbar theme={theme} onToggleTheme={onToggleTheme} />
        <main className="mx-auto w-full max-w-6xl flex-1 px-4 pb-32 pt-6 sm:px-6">
          <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  );
}
