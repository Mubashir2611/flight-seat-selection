import { MEALS } from "../data/meals";

export function getMealPrice(mealId) {
  return MEALS.find((meal) => meal.id === mealId)?.price ?? 0;
}

export function getPassengerSeatPrice(passenger, inventory) {
  return passenger.seatId ? (inventory[passenger.seatId]?.price ?? 0) : 0;
}

export function calculateTotals(passengers, inventory) {
  const seatSubtotal = passengers.reduce(
    (total, passenger) => total + getPassengerSeatPrice(passenger, inventory),
    0,
  );
  const mealSubtotal = passengers.reduce(
    (total, passenger) => total + getMealPrice(passenger.mealId),
    0,
  );

  return {
    seatSubtotal,
    mealSubtotal,
    grandTotal: seatSubtotal + mealSubtotal,
  };
}
