# Flight Seat Selection & Passenger Management

React and Vite application for selecting passengers and assigning aircraft seats.

## Development

```bash
npm install
npm run dev
```

## Checks

```bash
npm run test:run
npm run build
npm run preview
```

## Architecture

## State and assignment logic

Passenger, active selection, layout, and pending layout-conflict state are managed locally with a custom `useFlightSelection` hook. Passenger records own only their seat ID and meal ID. Seat ownership is derived from passenger records, preventing the application from maintaining duplicate ownership state.

The pure domain functions reject occupied seats, unknown seats, and duplicate ownership. Reassigning a passenger updates their seat ID and automatically releases the previous seat.

Layout switching validates every assigned seat against the destination layout. If assignments are incompatible, the application opens a confirmation dialog and does not mutate passenger state until the user explicitly approves releasing those seats.

## Pricing

Seat categories and prices come from `src/data/seatInventory.js`. Meal prices come from `src/data/meals.js`. Seat, meal, and grand totals are derived on demand in `src/domain/pricing.js`; the application does not store duplicate total state.
