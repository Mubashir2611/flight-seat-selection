import { formatCurrency } from "../utils/currency";
import { getMealPrice, getPassengerSeatPrice } from "../domain/pricing";
import { MEALS } from "../data/meals";

export default function BookingSummary({ passengers, inventory, totals }) {
  return (
    <aside className="panel summary-panel" aria-labelledby="summary-heading">
      <div className="panel-heading">
        <div>
          <p className="eyebrow">Fare details</p>
          <h2 id="summary-heading">Summary</h2>
        </div>
      </div>

      <div className="summary-passengers">
        {passengers.map((passenger) => {
          const meal = MEALS.find((item) => item.id === passenger.mealId);
          const seatPrice = getPassengerSeatPrice(passenger, inventory);
          const mealPrice = getMealPrice(passenger.mealId);
          return (
            <div className="summary-row" key={passenger.id}>
              <div className="summary-traveler">
                <strong>{passenger.name}</strong>
                  <span>
                    {passenger.seatId ? `Seat ${passenger.seatId}` : "No seat selected"}
                    {meal ? ` · ${meal.name}` : ""}
                  </span>
              </div>
              <div className="summary-charge-list">
                <div><span>Seat</span><strong>{formatCurrency(seatPrice)}</strong></div>
                <div><span>Meal</span><strong>{formatCurrency(mealPrice)}</strong></div>
              </div>
            </div>
          );
        })}
      </div>

      <dl className="summary-totals">
        <div>
          <dt>Seats</dt>
          <dd>{formatCurrency(totals.seatSubtotal)}</dd>
        </div>
        <div>
          <dt>Meals</dt>
          <dd>{formatCurrency(totals.mealSubtotal)}</dd>
        </div>
        <div className="grand-total">
          <dt>Total</dt>
          <dd>{formatCurrency(totals.grandTotal)}</dd>
        </div>
      </dl>

      <button type="button" className="continue-button">
        Review selection
      </button>
    </aside>
  );
}
