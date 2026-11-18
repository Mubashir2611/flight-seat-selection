import { MEALS } from "../data/meals";
import { formatCurrency } from "../utils/currency";

export default function PassengerPanel({
  passengers,
  selectedPassengerId,
  inventory,
  onSelectPassenger,
  onUpdateName,
  onRemoveSeat,
  onSelectMeal,
}) {
  return (
    <section className="panel passenger-panel" aria-labelledby="passengers-heading">
      <div className="panel-heading">
        <div>
          <p className="eyebrow">Travellers</p>
          <h2 id="passengers-heading">Passengers</h2>
        </div>
        <span className="passenger-count-badge">{passengers.length}</span>
      </div>

      <div className="passenger-list">
        {passengers.map((passenger, index) => {
          const seat = passenger.seatId ? inventory[passenger.seatId] : null;
          const meal = MEALS.find((item) => item.id === passenger.mealId);
          const selected = passenger.id === selectedPassengerId;

          return (
            <article
              className={`passenger-card ${selected ? "active" : ""}`}
              key={passenger.id}
            >
              {selected && <span className="active-passenger-label">Selecting seat</span>}
              <div className="passenger-select">
                <button
                  type="button"
                  className="passenger-select-button"
                  aria-label={`Select ${passenger.name}`}
                  aria-pressed={selected}
                  onClick={() => onSelectPassenger(passenger.id)}
                >
                  <span className="passenger-avatar">{String(index + 1).padStart(2, "0")}</span>
                  <span className="passenger-meta">
                    <strong>{passenger.name}</strong>
                    <span className={passenger.seatId ? "seat-assignment" : ""}>
                      {passenger.seatId ? (
                        <>Seat <b>{passenger.seatId}</b></>
                      ) : (
                        "Seat not selected"
                      )}
                    </span>
                  </span>
                  <span className="passenger-chevron" aria-hidden="true">›</span>
                </button>
              </div>

              {seat && (
                <div className="passenger-price">
                  <span><i className="price-category-dot" />{seat.category}</span>
                  <strong>{seat.price === 0 ? "Free" : formatCurrency(seat.price)}</strong>
                </div>
              )}

              <div className="passenger-actions">
                <label>
                  <span>Meal</span>
                  <select
                    aria-label={`Meal for ${passenger.name}`}
                    value={passenger.mealId ?? "none"}
                    onChange={(event) =>
                      onSelectMeal(passenger.id, event.target.value)
                    }
                  >
                    {MEALS.map((option) => (
                      <option key={option.id} value={option.id}>
                        {option.name} — {formatCurrency(option.price)}
                      </option>
                    ))}
                  </select>
                </label>
                {selected &&
                  (passenger.seatId ? (
                    <button
                      type="button"
                      className="text-button"
                      onClick={() => onRemoveSeat(passenger.id)}
                    >
                      Remove seat
                    </button>
                  ) : (
                    <span className="meal-summary">
                      {meal?.name ?? "No meal"} · {formatCurrency(meal?.price ?? 0)}
                    </span>
                  ))}
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
