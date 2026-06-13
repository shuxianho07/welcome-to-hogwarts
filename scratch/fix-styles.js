const fs = require('fs');
const path = require('path');

const dirs = [
  'd:/welcome-to-hogwarts/fallback-app/src/components',
  'd:/welcome-to-hogwarts/fallback-app/src/pages'
];

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Color replacements
  content = content.replace(/text-slate-950/g, 'text-[#0a0a12]');
  content = content.replace(/text-slate-900/g, 'text-[#12111d]');
  content = content.replace(/text-slate-800/g, 'text-[#1a1510]');
  content = content.replace(/text-slate-700/g, 'text-hogwarts-parchment/80');
  content = content.replace(/text-slate-500/g, 'text-hogwarts-parchment/60');
  content = content.replace(/text-slate-400/g, 'text-hogwarts-parchment/50');
  content = content.replace(/text-slate-300/g, 'text-hogwarts-parchment/40');
  content = content.replace(/text-slate-200/g, 'text-hogwarts-parchment/30');
  content = content.replace(/text-slate-50/g, 'text-hogwarts-parchment');
  
  content = content.replace(/bg-slate-950/g, 'bg-[#0a0a12]');
  content = content.replace(/bg-slate-900/g, 'bg-[#12111d]');
  content = content.replace(/bg-slate-800/g, 'bg-[#1a1510]');
  content = content.replace(/bg-slate-700/g, 'bg-[#3a3845]');
  content = content.replace(/bg-slate-200/g, 'bg-hogwarts-gold/20');
  content = content.replace(/bg-slate-100/g, 'bg-hogwarts-gold/10');
  content = content.replace(/bg-slate-50/g, 'bg-hogwarts-parchment');

  content = content.replace(/border-slate-800/g, 'border-hogwarts-gold/30');
  content = content.replace(/border-slate-700/g, 'border-hogwarts-gold/20');
  content = content.replace(/border-slate-200/g, 'border-hogwarts-gold/10');
  
  content = content.replace(/emerald-[0-9]{3}/g, 'hogwarts-gold');
  content = content.replace(/amber-[0-9]{3}/g, 'hogwarts-gold');
  
  // Font replacements
  content = content.replace(/font-semibold/g, 'font-[\'Cinzel\'] font-semibold');
  content = content.replace(/font-bold/g, 'font-[\'Cinzel\'] font-bold');
  
  // Replace white
  content = content.replace(/text-white\/([0-9]+)/g, 'text-hogwarts-parchment/$1');
  content = content.replace(/text-white/g, 'text-hogwarts-parchment');
  content = content.replace(/bg-white\/([0-9]+)/g, 'bg-hogwarts-parchment/$1');
  
  // For buttons that had bg-white text-slate-950, they might become bg-hogwarts-parchment text-[#0a0a12] which is fine.

  // Remove duplicate font classes if any
  content = content.replace(/font-\['Cinzel'\] font-\['Cinzel'\]/g, "font-['Cinzel']");
  
  fs.writeFileSync(filePath, content, 'utf8');
}

function walk(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      walk(fullPath);
    } else if (fullPath.endsWith('.jsx')) {
      // Don't modify Hero or Navbar again since we just hand-tuned them
      if (!fullPath.includes('Hero.jsx') && !fullPath.includes('Navbar.jsx')) {
        processFile(fullPath);
      }
    }
  }
}

dirs.forEach(walk);
console.log('Finished updating JSX files.');
