# NoseWork App

A web application for planning, running and reviewing canine scent‑detection training sessions.

---

## Table of Contents

- [Description](#description)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Available Scripts](#available-scripts)
- [Project Structure](#project-structure)
- [Pages & Components](#pages--components)
- [Styling](#styling)

---

## Description

NoseWork App helps trainers and handlers plan scent‑detection (“nose work”) exercises for dogs, execute trials with video upload, and analyze results (D′‑prime scores, trial outcomes, etc.). It supports multi‑trial sessions, random training‑plan generation, and PDF export of training programs.

---

## Features

- **User authentication**: login & logout flows with token storage.
- **Session management**: create, list, delete training sessions.
- **Training plan**: generate manual or random scent‑placement plans.
- **Trial execution**: step‑by‑step trials with live video upload to S3 (Uppy/AWS S3 multipart).
- **Analysis & review**: D′‑prime scoring, result modals, session overview with video playback.
- **PDF export**: generate printable training‑plan documents via jsPDF & html2canvas.

---

## Tech Stack

- **Framework & Build**: [Vite](https://vitejs.dev/) + React 18 :contentReference[oaicite:0]{index=0}
- **Routing**: React Router Dom v7 :contentReference[oaicite:1]{index=1}
- **State & Hooks**: React useState, useEffect, Context
- **Modals & UI**: react‑modal, CSS Modules
- **File uploads**: Dashboard & AWS‑S3‑Multipart plugins :contentReference[oaicite:2]{index=2}
- **PDF export**: jsPDF + html2canvas
- **Date utils**: date‑fns
- **Language**: JavaScript (ESM), CSS

---

## Prerequisites

- Node.js v16+ & npm (or Yarn)

---

## Installation

1. **Clone** this repository:
   ```bash
   git clone https://github.com/drmisssciurus/nosework-app.git
   cd nosework-app
   ```

## Project Structure

nosework-app/
├─ public/ # Static assets (favicon, index.html)
├─ src/
│ ├─ assets/ # Images, icons
│ ├─ components/ # Reusable UI components
│ ├─ pages/ # Route‑level components (see below) :contentReference[oaicite:4]{index=4}
│ ├─ utils/ # Helper functions & auth handlers
│ ├─ App.jsx # Root router & layout
│ ├─ main.jsx # React entrypoint
│ └─ index.css # Global styles & CSS variables
├─ .gitignore
├─ package.json # Dependencies & scripts :contentReference[oaicite:5]{index=5}
├─ vite.config.js # Dev‑server & proxy config :contentReference[oaicite:6]{index=6}
└─ README.md # Project documentation

## Styling

Global: CSS variables & resets in src/index.css
Modules: each page or component uses its own .module.css for scoped styles
Fonts: Poppins & Noto Sans Hebrew imported via Google Fonts

## Pages & Components

Welcome: landing page for all users
LogIn: email/password login with “forgot password” & registration modals
MainPage: dashboard showing today’s date, session list & navigation
DogsList / AddDog: manage canine profiles
NewSession: form to schedule a new training session
TrainingPlan: select or randomize container placements
Trials: conduct each trial, upload video to S3, record result
EndSession: summary & success screen
SessionOverview: review session details, D′‑prime score & trial videos
PageNotFound: catch‑all 404 route

## Available Scripts

npm run dev - Start Vite dev‑server (HMR)
npm run build - Build for production (dist/)
npm run preview - Preview production build locally
npm run lint - Run ESLint on all source files
