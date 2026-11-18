export const MIN_PASSENGERS = 1;
export const MAX_PASSENGERS = 9;

export function createPassengers(count) {
  const safeCount = Math.min(MAX_PASSENGERS, Math.max(MIN_PASSENGERS, count));
  return Array.from({ length: safeCount }, (_, index) => ({
    id: `passenger-${index + 1}`,
    name: `Passenger ${index + 1}`,
    seatId: null,
    mealId: "none",
  }));
}

export function resizePassengers(passengers, count) {
  const safeCount = Math.min(MAX_PASSENGERS, Math.max(MIN_PASSENGERS, Number(count)));
  if (safeCount > passengers.length) {
    const additions = createPassengers(safeCount).slice(passengers.length);
    return [...passengers, ...additions];
  }
  return passengers.slice(0, safeCount);
}
