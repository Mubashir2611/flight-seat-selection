export const AIRCRAFT_LAYOUTS = {
  "3-2": {
    id: "3-2",
    label: "3-2",
    description: "Three seats, aisle, two seats",
    rowCount: 8,
    groups: [
      { id: "left", letters: ["A", "B", "C"] },
      { id: "right", letters: ["D", "E"] },
    ],
  },
  "2-3-2": {
    id: "2-3-2",
    label: "2-3-2",
    description: "Two seats, aisle, three seats, aisle, two seats",
    rowCount: 8,
    groups: [
      { id: "left", letters: ["A", "B"] },
      { id: "center", letters: ["D", "E", "F"] },
      { id: "right", letters: ["G", "H"] },
    ],
  },
};
