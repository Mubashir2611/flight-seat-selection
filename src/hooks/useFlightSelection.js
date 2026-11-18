import { useMemo, useState } from "react";
import { AIRCRAFT_LAYOUTS } from "../data/aircraftLayouts";
import { createSeatInventory } from "../data/seatInventory";
import { createPassengers, resizePassengers } from "../domain/passengerRules";
import {
  analyzeLayoutSwitch,
  assignSeat,
  confirmLayoutSwitch,
  getSeatOwnerMap,
  removePassengerSeat,
} from "../domain/seatRules";
import { calculateTotals } from "../domain/pricing";

export function useFlightSelection() {
  const [passengers, setPassengers] = useState(() => createPassengers(2));
  const [selectedPassengerId, setSelectedPassengerId] = useState("passenger-1");
  const [layoutId, setLayoutId] = useState("3-2");
  const [pendingLayoutId, setPendingLayoutId] = useState(null);
  const [pendingIncompatible, setPendingIncompatible] = useState([]);
  const [statusMessage, setStatusMessage] = useState("Select a seat for Passenger 1.");

  const layout = AIRCRAFT_LAYOUTS[layoutId];
  const inventory = useMemo(() => createSeatInventory(layout), [layout]);
  const ownerMap = useMemo(() => getSeatOwnerMap(passengers), [passengers]);
  const totals = useMemo(
    () => calculateTotals(passengers, inventory),
    [passengers, inventory],
  );
  const selectedPassenger =
    passengers.find((passenger) => passenger.id === selectedPassengerId) ??
    passengers[0] ??
    null;

  function setPassengerCount(count) {
    const next = resizePassengers(passengers, count);
    setPassengers(next);
    setSelectedPassengerId((selectedId) =>
      next.some((passenger) => passenger.id === selectedId)
        ? selectedId
        : next[0]?.id ?? null,
    );
    setStatusMessage(`Passenger count updated to ${next.length}.`);
  }

  function selectPassenger(passengerId) {
    const passenger = passengers.find((item) => item.id === passengerId);
    if (!passenger) return;
    setSelectedPassengerId(passengerId);
    setStatusMessage(
      passenger.seatId
        ? `${passenger.name} is assigned to ${passenger.seatId}.`
        : `${passenger.name} has no seat assigned.`,
    );
  }

  function updatePassengerName(passengerId, name) {
    const safeName = name.trim() || "Passenger";
    setPassengers((current) =>
      current.map((passenger) =>
        passenger.id === passengerId
          ? { ...passenger, name: safeName }
          : passenger,
      ),
    );
  }

  function assignSelectedSeat(seatId) {
    if (!selectedPassenger) {
      setStatusMessage("Select a passenger before choosing a seat.");
      return;
    }
    setPassengers((current) => {
      const result = assignSeat(current, selectedPassenger.id, seatId, inventory);
      setStatusMessage(
        result.ok
          ? `${selectedPassenger.name} assigned to ${seatId}.`
          : result.reason,
      );
      return result.passengers;
    });
  }

  function removeSeat(passengerId = selectedPassenger?.id) {
    if (!passengerId) return;
    setPassengers((current) => {
      const result = removePassengerSeat(current, passengerId);
      if (result.ok) setStatusMessage("Seat assignment removed.");
      else setStatusMessage(result.reason);
      return result.passengers;
    });
  }

  function requestLayoutSwitch(nextLayoutId) {
    const destination = AIRCRAFT_LAYOUTS[nextLayoutId];
    if (!destination || destination.id === layoutId) return;
    const analysis = analyzeLayoutSwitch(passengers, destination);
    if (analysis.incompatible.length) {
      setPendingLayoutId(nextLayoutId);
      setPendingIncompatible(analysis.incompatible);
      setStatusMessage(
        `Switching requires releasing ${analysis.incompatible
          .map((item) => `${item.passengerName}'s seat ${item.seatId}`)
          .join(", ")}.`,
      );
      return;
    }
    setLayoutId(nextLayoutId);
    setPendingLayoutId(null);
    setStatusMessage(`Switched to ${destination.label} layout.`);
  }

  function confirmPendingLayoutSwitch() {
    if (!pendingLayoutId) return;
    const destination = AIRCRAFT_LAYOUTS[pendingLayoutId];
    setPassengers((current) => confirmLayoutSwitch(current, destination).passengers);
    setLayoutId(pendingLayoutId);
    setPendingLayoutId(null);
    setPendingIncompatible([]);
    setStatusMessage(
      `Layout switched to ${destination.label}. Incompatible seat assignments were explicitly released.`,
    );
  }

  function cancelPendingLayoutSwitch() {
    setPendingLayoutId(null);
    setPendingIncompatible([]);
    setStatusMessage("Layout switch canceled. Seat assignments are unchanged.");
  }

  function selectMeal(passengerId, mealId) {
    const passenger = passengers.find((item) => item.id === passengerId);
    if (!passenger) return;
    setPassengers((current) =>
      current.map((passenger) =>
        passenger.id === passengerId
          ? { ...passenger, mealId }
          : passenger,
      ),
    );
    setStatusMessage(`Meal updated for ${passenger.name}.`);
  }

  return {
    passengers,
    selectedPassenger,
    selectedPassengerId,
    layout,
    layoutId,
    inventory,
    ownerMap,
    totals,
    statusMessage,
    pendingLayoutId,
    pendingIncompatible,
    setPassengerCount,
    selectPassenger,
    updatePassengerName,
    assignSelectedSeat,
    removeSeat,
    requestLayoutSwitch,
    confirmPendingLayoutSwitch,
    cancelPendingLayoutSwitch,
    selectMeal,
  };
}
