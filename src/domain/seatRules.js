export function getLayoutSeatIds(layout) {
  const ids = [];
  for (let row = 1; row <= layout.rowCount; row += 1) {
    for (const group of layout.groups) {
      for (const letter of group.letters) ids.push(`${row}${letter}`);
    }
  }
  return new Set(ids);
}

export function getSeatOwnerMap(passengers) {
  return passengers.reduce((map, passenger) => {
    if (passenger.seatId) map.set(passenger.seatId, passenger.id);
    return map;
  }, new Map());
}

export function assignSeat(passengers, passengerId, seatId, inventory) {
  const passenger = passengers.find((item) => item.id === passengerId);
  if (!passenger) return { ok: false, reason: "Passenger not found", passengers };
  if (!inventory[seatId]) return { ok: false, reason: "Seat is not available in this layout", passengers };
  if (inventory[seatId].occupied) return { ok: false, reason: `${seatId} is already occupied`, passengers };

  const owner = getSeatOwnerMap(passengers).get(seatId);
  if (owner && owner !== passengerId) {
    const ownerPassenger = passengers.find((item) => item.id === owner);
    return {
      ok: false,
      reason: `${seatId} is assigned to ${ownerPassenger?.name ?? "another passenger"}`,
      passengers,
    };
  }
  if (passenger.seatId === seatId) {
    return { ok: true, reason: `${seatId} is already assigned`, passengers };
  }

  return {
    ok: true,
    passengers: passengers.map((item) =>
      item.id === passengerId ? { ...item, seatId } : item,
    ),
  };
}

export function removePassengerSeat(passengers, passengerId) {
  if (!passengers.some((item) => item.id === passengerId)) {
    return { ok: false, reason: "Passenger not found", passengers };
  }
  return {
    ok: true,
    passengers: passengers.map((item) =>
      item.id === passengerId ? { ...item, seatId: null } : item,
    ),
  };
}

export function analyzeLayoutSwitch(passengers, destinationLayout) {
  const seatIds = getLayoutSeatIds(destinationLayout);
  const incompatible = passengers
    .filter((passenger) => passenger.seatId && !seatIds.has(passenger.seatId))
    .map((passenger) => ({
      passengerId: passenger.id,
      passengerName: passenger.name,
      seatId: passenger.seatId,
    }));

  return { seatIds, incompatible };
}

export function applyLayoutSwitch(passengers, destinationLayout) {
  const { seatIds, incompatible } = analyzeLayoutSwitch(passengers, destinationLayout);
  if (incompatible.length) {
    return {
      ok: false,
      requiresConfirmation: true,
      incompatible,
      passengers,
    };
  }
  return { ok: true, incompatible: [], passengers };
}

export function confirmLayoutSwitch(passengers, destinationLayout) {
  const { seatIds } = analyzeLayoutSwitch(passengers, destinationLayout);
  return {
    ok: true,
    passengers: passengers.map((passenger) =>
      passenger.seatId && !seatIds.has(passenger.seatId)
        ? { ...passenger, seatId: null }
        : passenger,
    ),
  };
}
