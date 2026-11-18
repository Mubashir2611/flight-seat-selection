import { describe, expect, it } from "vitest";
import { AIRCRAFT_LAYOUTS } from "../data/aircraftLayouts";
import { createSeatInventory } from "../data/seatInventory";
import { calculateTotals, getPassengerSeatPrice } from "./pricing";

const inventory = createSeatInventory(AIRCRAFT_LAYOUTS["3-2"]);

describe("pricing", () => {
  it("derives free and paid seat prices from seat inventory", () => {
    expect(getPassengerSeatPrice({ seatId: "1A" }, inventory)).toBe(0);
    expect(getPassengerSeatPrice({ seatId: "1C" }, inventory)).toBe(350);
  });

  it("calculates seat, meal, and grand totals", () => {
    const passengers = [
      { id: "p1", seatId: "1C", mealId: "none" },
      { id: "p2", seatId: "1E", mealId: "chicken" },
    ];

    expect(calculateTotals(passengers, inventory)).toEqual({
      seatSubtotal: 600,
      mealSubtotal: 300,
      grandTotal: 900,
    });
  });

  it("returns zero totals for unassigned passengers", () => {
    expect(
      calculateTotals([{ seatId: null, mealId: "none" }], inventory),
    ).toEqual({ seatSubtotal: 0, mealSubtotal: 0, grandTotal: 0 });
  });

  it("includes free and paid meal choices separately", () => {
    const passengers = [
      { id: "p1", seatId: "1A", mealId: "vegetarian" },
      { id: "p2", seatId: "1E", mealId: "special" },
    ];

    expect(calculateTotals(passengers, inventory)).toEqual({
      seatSubtotal: 250,
      mealSubtotal: 450,
      grandTotal: 700,
    });
  });
});
