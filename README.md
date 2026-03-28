<div align="center">

<img src="https://raw.githubusercontent.com/lucide-icons/lucide/main/icons/flame.svg" width="64" height="64" alt="HabitFlow Logo" />

# HabitFlow

**Build better habits. Track your streaks. Own your day.**

[![React](https://img.shields.io/badge/React-19-%2361DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-8-%23646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-3-%2338BDF8?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-%23000000?style=for-the-badge&logo=vercel&logoColor=white)](https://vercel.com)

[Live Demo](#) · [Report Bug](../../issues) · [Request Feature](../../issues)

</div>

---

## Overview

HabitFlow is a fully client-side daily habit tracker with a dark glassmorphism UI. It supports multiple user accounts, persistent streaks, a weekly timetable, a real-time consistency heatmap, and a focus timer — all without a backend. Every user's data is isolated and stored locally in the browser.

---

## Features

| Feature | Description |
|---|---|
| 🔐 Auth | Register & login with per-user `localStorage` isolation |
| ✅ Habit Tracking | Add, complete, and delete habits with daily progress reset |
| 🔥 Streak System | Streak counts on every login or any single task completion |
| 🗓️ Timetable | Weekly schedule builder with time blocks, repeat days & colors |
| 📅 Today View | Unified view of today's habits and scheduled tasks |
| 🌡️ Heatmap | 17-week consistency grid with 5 intensity levels |
| ⏱️ Focus Timer | Adjustable countdown with a 5-second audio chime on completion |
| 📓 Life Log | Daily entries with mood picker, notes, and real bar chart |
| 🏆 Challenges | Join multi-day challenges and track progress per account |
| � Account | Full data reset option and sign out |

---

## Tech Stack

- **Framework** — [React 19](https://react.dev)
- **Build Tool** — [Vite 8](https://vitejs.dev)
- **Styling** — [Tailwind CSS 3](https://tailwindcss.com)
- **Icons** — [Lucide React](https://lucide.dev)
- **Audio** — Web Audio API (no external files)
- **Storage** — Browser `localStorage` (no backend required)

---

## Getting Started

### Prerequisites

- Node.js `v18+`
- npm `v9+`

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/your-username/habitflow.git

# 2. Navigate into the project
cd habitflow/daily_habit

# 3. Install dependencies
npm install

# 4. Start the development server
npm run dev
```

Visit `http://localhost:5173` in your browser.

### Available Scripts

```bash
npm run dev        # Start development server
npm run build      # Build for production
npm run preview    # Preview production build locally
npm run lint       # Run ESLint
```

---

## Project Structure

```
daily_habit/
├── src/
│   ├── components/
│   │   ├── AccountView.jsx       # Account settings & full reset
│   │   ├── ChallengesView.jsx    # Multi-day challenges with progress
│   │   ├── Heatmap.jsx           # 17-week consistency heatmap
│   │   ├── LifeLog.jsx           # Daily log — mood, notes, bar chart
│   │   ├── LoginPage.jsx         # Register / sign in
│   │   ├── MobileDock.jsx        # Fixed bottom nav (mobile)
│   │   ├── Sidebar.jsx           # Desktop sidebar navigation
│   │   ├── Timer.jsx             # Adjustable focus timer UI
│   │   ├── TimetableView.jsx     # Weekly schedule builder
│   │   └── TodayView.jsx         # Today's habits + schedule
│   ├── context/
│   │   └── AuthContext.jsx       # Auth state & user data layer
│   ├── hooks/
│   │   └── useTimer.jsx          # Timer logic + Web Audio chime
│   ├── App.jsx                   # Root layout, routing, habit logic
│   ├── main.jsx                  # Entry point with AuthProvider
│   └── index.css                 # Tailwind + custom animations
├── public/
├── vercel.json                   # SPA rewrite rule for Vercel
├── vite.config.js
├── tailwind.config.js
└── package.json
```

---

## Deployment

### Vercel (Recommended)

1. Push the repository to GitHub
2. Go to [vercel.com](https://vercel.com) → **Add New Project** → Import your repo
3. Configure the project settings:

   | Setting | Value |
   |---|---|
   | Root Directory | `daily_habit` |
   | Framework Preset | `Vite` |
   | Build Command | `npm run build` |
   | Output Directory | `dist` |

4. Click **Deploy**

The included `vercel.json` handles SPA client-side routing automatically.

### Vercel CLI

```bash
npm install -g vercel
cd daily_habit
vercel --prod
```

---

## Data & Privacy

HabitFlow stores all data exclusively in the browser's `localStorage`. There is no server, no database, and no data transmission of any kind. Clearing browser storage or using a different device will result in a fresh state.

---

## Roadmap

- [ ] Cloud sync via Supabase or Firebase
- [ ] Push / browser notifications for scheduled tasks
- [ ] Per-habit individual streak tracking
- [ ] CSV / JSON data export
- [ ] Light theme support
- [ ] PWA support for mobile install

---

## Contributing

Contributions are welcome. Please open an issue first to discuss what you'd like to change, then submit a pull request.

1. Fork the repository
2. Create a feature branch — `git checkout -b feature/your-feature`
3. Commit your changes — `git commit -m 'Add your feature'`
4. Push to the branch — `git push origin feature/your-feature`
5. Open a Pull Request

---

## License

Distributed under the [MIT License](LICENSE).

---

<div align="center">

Made with ❤️ by [Balu](https://github.com/your-username)

</div>
