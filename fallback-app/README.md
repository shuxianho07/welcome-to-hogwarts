# Jackie Zou Portfolio

React + Vite portfolio for Jackie (Jiaqi) Zou, focused on AI infrastructure, backend engineering, data systems, quantitative research tools, and full-stack product workflows.

## Tech Stack

- React 18
- Vite
- Tailwind CSS
- Framer Motion
- React Router
- React Icons
- Vercel Analytics

## Run Locally

```sh
npm install
npm run dev
```

## Build

```sh
npm run build
```

The production output is written to `dist/`.

## Project Structure

- `src/App.jsx` - routes, theme state, and analytics
- `src/pages/` - route-level page wrappers
- `src/components/` - reusable portfolio sections and cards
- `src/data/` - projects, skills, awards, and experience content
- `css/styles.css` - shared global styling imported by `src/index.css`
- `public/` - static assets served by Vite, including resume and images

## Active Public Assets

- `public/resume.pdf` is used by the Resume page.
- `public/images/profile.jpg` is used in the homepage hero.
- `public/images/header.jpg` is available for future visual sections.

## Notes

- The old static HTML/JavaScript portfolio layer has been removed.
- Portfolio content should be updated through the React data files under `src/data/`.
- Salary and pay-potential positioning should stay private and should not be shown publicly.
