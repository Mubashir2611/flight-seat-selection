import { describe, expect, it } from "vitest";
import {
  createPassengers,
  MAX_PASSENGERS,
  resizePassengers,
} from "./passengerRules";

describe("passenger rules", () => {
  it("creates the requested passenger count", () => {
    expect(createPassengers(3)).toHaveLength(3);
  });

  it("clamps passenger count to supported limits", () => {
    expect(createPassengers(0)).toHaveLength(1);
    expect(createPassengers(MAX_PASSENGERS + 10)).toHaveLength(MAX_PASSENGERS);
  });

  it("preserves existing passenger records when adding", () => {
    const passengers = createPassengers(2);
    const resized = resizePassengers(passengers, 3);

    expect(resized).toHaveLength(3);
    expect(resized[0]).toBe(passengers[0]);
    expect(resized[1]).toBe(passengers[1]);
  });

  it("releases trailing passenger assignments when reducing count", () => {
    const passengers = createPassengers(3).map((passenger, index) =>
      index === 2 ? { ...passenger, seatId: "1C" } : passenger,
    );
    const resized = resizePassengers(passengers, 2);

    expect(resized).toHaveLength(2);
    expect(resized.every((passenger) => passenger.id !== "passenger-3")).toBe(true);
  });
});
