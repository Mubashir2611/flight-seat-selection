# Flight Seat Selection & Passenger Management

A responsive React and Vite flight booking interface for passenger management, aircraft seat selection, meals, fares, and appearance themes.

## Features

- 1-9 passengers with passenger switching
- 3-2 and 2-3-2 aircraft layouts
- One seat per passenger and no duplicate seat ownership
- Occupied, available, selected, and paid seat states
- Seat reassignment and removal
- Free and paid meals
- Automatic seat, meal, and grand totals
- Confirmed layout-switch handling for incompatible seats
- System, light, and dark themes
- Desktop, tablet, and mobile responsive UI

## Prerequisites

- Node.js 18+
- npm or Yarn

## Setup

```bash
npm install
npm run dev
```

Open the URL shown by Vite, usually `http://localhost:5173`.

## Commands

```bash
npm run dev       # Development server
npm run test:run  # Run tests
npm run build     # Create production build
npm run preview   # Preview production build
```

## Project Structure

```text
src/
├── components/   # UI components
├── data/         # Layout, seat, and meal data
├── domain/       # Assignment, passenger, and pricing rules
├── hooks/        # Application and theme state
├── test/         # Test setup
└── App.jsx       # Application composition
```

## State and Assignment Logic

The `useFlightSelection` hook manages passengers, the active passenger, layout, and status feedback. Passenger records store only `seatId` and `mealId`; seat ownership is derived from passenger data.

`seatRules.js` prevents occupied seats and duplicate ownership. Reassigning a passenger replaces their old seat ID. Layout switching checks compatible seat IDs and asks for confirmation before releasing incompatible assignments.

`pricing.js` derives seat subtotal, meal subtotal, and grand total from inventory and passenger data. Totals are not stored separately.

## Tests

Tests cover passenger management, seat assignment, occupied and duplicate seats, layout switching, pricing, meals, themes, removal, and reassignment.

```bash
npm run test:run
```

## Production Build

```bash
npm run build
```

Deploy the generated `dist/` directory.

## Vercel Deployment

| Setting | Value |
|---|---|
| Framework | Vite |
| Root directory | `.` or blank |
| Build command | `npm run build` |
| Output directory | `dist` |

No environment variables or backend configuration are required.
