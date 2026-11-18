export const OCCUPIED_SEAT_IDS = new Set(["2C", "3F", "5A", "6H", "7D"]);

export const SEAT_CATEGORY_PRICES = {
  Standard: 0,
  "Extra Legroom": 350,
  Premium: 250,
  Window: 150,
};

export function getSeatCategory(seatId) {
  const row = Number(seatId.slice(0, -1));
  const letter = seatId.slice(-1);

  if (letter === "C" && row === 1) return "Extra Legroom";
  if (letter === "A" && row === 2) return "Extra Legroom";
  if (letter === "E" && row === 1) return "Premium";
  if (["C", "F"].includes(letter) && row >= 6) return "Premium";
  return "Standard";
}

export function createSeatInventory(layout) {
  const inventory = {};

  for (let row = 1; row <= layout.rowCount; row += 1) {
    for (const group of layout.groups) {
      for (const letter of group.letters) {
        const id = `${row}${letter}`;
        const category = getSeatCategory(id);
        inventory[id] = {
          id,
          row,
          label: letter,
          category,
          price: SEAT_CATEGORY_PRICES[category],
          occupied: OCCUPIED_SEAT_IDS.has(id),
        };
      }
    }
  }

  return inventory;
}
