export default function Footer() {
  return (
    <footer className="mt-16 border-t border-hogwarts-gold/10 py-8 text-sm text-slate-600 dark:border-white/10 dark:text-hogwarts-parchment/60">
      <div className="container flex flex-col items-center justify-between gap-4 sm:flex-row">
        <div>&copy; {new Date().getFullYear()} Susan Ho. All rights reserved.</div>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <a
            href="https://www.linkedin.com/in/shuxian-susan-ho/"
            target="_blank"
            rel="noreferrer"
            className="hover:text-hogwarts-bg dark:hover:text-hogwarts-parchment"
          >
            LinkedIn
          </a>
          <a
            href="https://github.com/shuxianho07"
            target="_blank"
            rel="noreferrer"
            className="hover:text-hogwarts-bg dark:hover:text-hogwarts-parchment"
          >
            GitHub
          </a>
          <a
            href="mailto:s39ho@uwaterloo.ca"
            className="hover:text-hogwarts-bg dark:hover:text-hogwarts-parchment"
          >
            Email
          </a>
        </div>
      </div>
    </footer>
  );
}
