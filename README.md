# 🏰 Welcome to Hogwarts — Interactive Portfolio

> A Hogwarts-themed, browser-based 2D portfolio experience. Walk around the castle grounds, step inside the Common Room, and discover my skills, experience, and projects through interactive hotspots.

**🌐 Live Demo:** [welcome-to-hogwarts.vercel.app](https://welcome-to-hogwarts.vercel.app)

[![Deploy Status](https://img.shields.io/badge/Vercel-Deployed-black?logo=vercel)](https://welcome-to-hogwarts.vercel.app)

---

## ✨ Features

- **2D Side-Scrolling Game Engine** — Custom-built in vanilla JavaScript with physics, gravity, and smooth camera tracking
- **Animated Character** — Pixel-style sprite with walk cycles, jump animations, and directional flipping
- **Two Scenes** — Explore the Hogwarts exterior, then enter the Common Room to find portfolio content
- **Portfolio Overlays** — Interactive hotspots reveal Skills, Work Experience, Projects, and About sections
- **Day / Night Mode** — Toggle between `Luminos` (day) and `Nox` (night) themes
- **Mobile-Friendly** — Touch controls for left, right, and jump on mobile devices
- **Loading Screen** — Animated spell-casting progress bar with rotating Hogwarts phrases
- **Idle Dialogue** — The character whispers mysterious quotes when left standing still

---

## 🗂️ Project Structure

```
welcome-to-hogwarts/
├── index.html        # Game layout, UI overlays, portfolio content
├── styles.css        # Design tokens, scene styles, animations
├── script.js         # Game engine: physics, sprites, camera, interactions
└── assets/           # Sprite sheets and scene backgrounds
    ├── front.png         # Idle sprite (front-facing)
    ├── back.png          # Walking-away sprite
    ├── walking.png       # Walk cycle frame 1
    ├── right_facing.png  # Walk cycle frame 2 / stop
    ├── left jump.png     # Jump sprite
    ├── morning.png       # Outside daytime background
    ├── night.jpg         # Outside night background (Nox mode)
    ├── corridor.jpg      # Inside Common Room background
    └── door.png          # Entrance door asset
```

---

## 🎮 How to Play

| Input | Action |
|---|---|
| `A` / `←` | Move left |
| `D` / `→` | Move right |
| `W` / `↑` / `Space` | Jump |
| `E` / `Enter` | Interact with hotspot |
| Click interact prompt | Enter door / open overlay |
| **Nox** button (top right) | Toggle day / night |
| **⬅ Back Outside** button | Return to castle grounds |

**On mobile**, use the on-screen arrow buttons.

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Structure | HTML5 |
| Styling | Vanilla CSS (custom design tokens, CSS animations) |
| Logic | Vanilla JavaScript (ES6+) |
| Fonts | Google Fonts — Cinzel Decorative, Cinzel, Outfit |
| Rendering | DOM-based (no canvas game loop, no frameworks) |

The game engine is entirely hand-rolled — no libraries, no bundlers. All sprite processing (white background removal) is done at runtime via the Canvas 2D API.

---

## 🚀 Running Locally

No build step required. Just open the file in a browser:

```bash
# Clone the repo
git clone https://github.com/shuxianho07/welcome-to-hogwarts.git
cd welcome-to-hogwarts

# Open in browser (any of the following)
# Option 1: Double-click index.html
# Option 2: Use a local dev server (recommended to avoid CORS issues with assets)
npx serve .
```

> **Note:** Opening `index.html` directly with `file://` may block sprite loading in some browsers due to CORS restrictions. Using a local server like `npx serve .` or VS Code's Live Server extension is recommended.

---

## 👩‍💻 About Susan

**Susan (Shuxian) Ho** is a Data Analyst & Backend Engineer passionate about AI, automation, and building delightful digital experiences.

- 🏛 **City of Markham** — Data Analyst: end-to-end Python automation & executive reporting
- 🎨 **Adobe** — Data Analyst Intern: Python & SQL telemetry data pipelines
- 🎓 Studying Computer Science with a focus on data systems, ML, and full-stack development

**Connect:**
[![GitHub](https://img.shields.io/badge/GitHub-shuxianho07-181717?logo=github)](https://github.com/shuxianho07)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-shuxian--susan--ho-0A66C2?logo=linkedin)](https://www.linkedin.com/in/shuxian-susan-ho/)

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
