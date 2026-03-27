# Próxima Folga

A modern web app for employees to calculate upcoming days off based on their work schedule rotation.

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white)

---

## Features

- **Automatic calculation** — enter your last day off and instantly see the next scheduled days off
- **Special rule support** — if the day off falls on a Friday, Saturday is automatically included (*dobradinha*)
- **Future date checker** — pick any future date and instantly see whether it's a day off
- **Monthly calendar** — a navigable grid highlighting days off and double-off days
- **Password authentication** — basic session-scoped login screen
- **Extensible job type system** — adding a new role requires only one config object, no code changes elsewhere

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### Install

```bash
npm install
```

### Configure the password

Copy the example env file and set your password:

```bash
cp .env.example .env.local
```

Edit `.env.local`:

```env
VITE_APP_PASSWORD=your_password_here
```

> `.env.local` is automatically ignored by git (covered by `*.local` in `.gitignore`).

### Run locally

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

---

## Project Structure

```
src/
├── config/
│   └── scheduleConfigs.ts    # Job type registry — add new roles here
├── types/
│   └── index.ts              # Shared TypeScript interfaces
├── utils/
│   ├── scheduleCalculator.ts # Core scheduling engine
│   └── dateUtils.ts          # pt-BR date formatting helpers
└── components/
    ├── Header.tsx
    ├── LoginScreen.tsx
    ├── JobTypeSelector.tsx
    ├── DateInput.tsx
    ├── ResultCard.tsx
    ├── FutureChecker.tsx
    └── CalendarView.tsx
```

---

## Adding a New Job Type

Open `src/config/scheduleConfigs.ts` and append an entry to `SCHEDULE_CONFIGS`:

```ts
{
  id: 'tecnico-enfermagem',
  label: 'Técnico de Enfermagem',
  cycleLength: 7,       // total days per cycle (work + off)
  offDaysInCycle: 2,    // consecutive days off per cycle
  // specialRules: [...] — optional, for rules like the Friday double-off
}
```

No other files need to be modified.

### Special Rules

A `specialRule` fires when the off day lands on a specific weekday and appends extra consecutive days off. Example (already configured for Farmacêutico):

```ts
specialRules: [
  {
    triggerDayOfWeek: 5,          // 5 = Friday
    extraDaysOff: 1,              // also gives Saturday off
    label: 'Dobradinha (Sex + Sáb)',
  },
],
```

When a special rule fires, the **next cycle begins the day after the last bonus day** (e.g. Sunday after a Fri+Sat double-off), so the rhythm stays correct.

---

## Schedule Logic — Farmacêutico

| Rule | Detail |
|---|---|
| Rotation | 3 days work → 1 day off |
| Friday exception | If day off = Friday → also off Saturday (*dobradinha*) |
| Next cycle after dobradinha | Starts Sunday (skips the bonus Saturday) |

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 19 + TypeScript |
| Build | Vite 8 |
| Styling | Vanilla CSS (dark mode, CSS custom properties) |
| Auth | Env-var password + `sessionStorage` |
| i18n | `Intl.DateTimeFormat` with `pt-BR` locale |
