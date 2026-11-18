import { describe, expect, it } from "vitest";
import { AIRCRAFT_LAYOUTS } from "../data/aircraftLayouts";
import { createSeatInventory } from "../data/seatInventory";
import {
  assignSeat,
  analyzeLayoutSwitch,
  confirmLayoutSwitch,
  removePassengerSeat,
} from "./seatRules";

const inventory = createSeatInventory(AIRCRAFT_LAYOUTS["3-2"]);

describe("seat assignment rules", () => {
  it("assigns a seat to one passenger", () => {
    const passengers = [
      { id: "p1", name: "Ada", seatId: null },
      { id: "p2", name: "Ben", seatId: null },
    ];
    const result = assignSeat(passengers, "p1", "1A", inventory);

    expect(result.ok).toBe(true);
    expect(result.passengers[0].seatId).toBe("1A");
  });

  it("moves a passenger and releases the old seat", () => {
    const passengers = [{ id: "p1", name: "Ada", seatId: "1A" }];
    const result = assignSeat(passengers, "p1", "1B", inventory);

    expect(result.passengers[0].seatId).toBe("1B");
  });

  it("rejects occupied and already-owned seats", () => {
    const passengers = [
      { id: "p1", name: "Ada", seatId: "1A" },
      { id: "p2", name: "Ben", seatId: null },
    ];

    expect(assignSeat(passengers, "p2", "2C", inventory).ok).toBe(false);
    expect(assignSeat(passengers, "p2", "1A", inventory).ok).toBe(false);
  });

  it("removes a passenger seat", () => {
    const passengers = [{ id: "p1", name: "Ada", seatId: "1A" }];
    const result = removePassengerSeat(passengers, "p1");

    expect(result.passengers[0].seatId).toBeNull();
  });
});

describe("layout switching", () => {
  it("reports incompatible assignments instead of deleting them", () => {
    const passengers = [{ id: "p1", name: "Ada", seatId: "1C" }];
    const analysis = analyzeLayoutSwitch(
      passengers,
      AIRCRAFT_LAYOUTS["2-3-2"],
    );

    expect(analysis.incompatible).toEqual([
      { passengerId: "p1", passengerName: "Ada", seatId: "1C" },
    ]);
  });

  it("only releases incompatible assignments after explicit confirmation", () => {
    const passengers = [
      { id: "p1", name: "Ada", seatId: "1C" },
      { id: "p2", name: "Ben", seatId: "1A" },
    ];
    const switched = confirmLayoutSwitch(
      passengers,
      AIRCRAFT_LAYOUTS["2-3-2"],
    );

    expect(switched.passengers[0].seatId).toBeNull();
    expect(switched.passengers[1].seatId).toBe("1A");
  });
});
