# React Portfolio with Vite

This project is a cleaned and modular React portfolio built with Vite.

## Features

- Cleaned `App.jsx` and `index.css`
- Folder structure: `components`, `pages`, `layouts`, `data`
- Reusable components: `Navbar`, `Button`, `ProjectCard`, `ProjectForm`, `ContactForm`
- React state and props instead of direct DOM manipulation
- Dynamic text updates with `useState`
- Dark/light mode through conditional class rendering
- Show/hide sections with conditional rendering
- Add/remove projects with state arrays
- Button click handling with `onClick`
- Controlled contact form with `onSubmit`
- Required field checks and basic email/message validation
- Instant validation feedback

## Run locally

```bash
npm install
npm run dev
```

Open the local URL printed by Vite, usually `http://localhost:5173`.

## Recommended Vite scaffold command

```bash
npm create vite@latest react-portfolio-vite -- --template react
cd react-portfolio-vite
npm install
npm run dev
```

## Main files

```text
src/
  components/
    Button.jsx
    ContactForm.jsx
    Navbar.jsx
    ProjectCard.jsx
    ProjectForm.jsx
  data/
    projects.js
  layouts/
    MainLayout.jsx
  pages/
    Home.jsx
  App.jsx
  index.css
  main.jsx
```
