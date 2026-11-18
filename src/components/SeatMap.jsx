import { formatCurrency } from "../utils/currency";

function SeatButton({
  seat,
  ownerId,
  ownerName,
  selectedPassengerId,
  onSelect,
}) {
  const ownerIsSelected = ownerId === selectedPassengerId;
  let state = "available";
  if (seat.occupied) state = "occupied";
  else if (ownerId) state = ownerIsSelected ? "selected" : "assigned";

  return (
    <button
      type="button"
      className={`seat seat-${state} seat-${seat.category.toLowerCase().replaceAll(" ", "-")}`}
      disabled={seat.occupied || (!!ownerId && !ownerIsSelected)}
      aria-label={
        seat.occupied
          ? `Seat ${seat.id}, occupied, ${formatCurrency(seat.price)}`
          : ownerId
            ? `Seat ${seat.id}, assigned to ${ownerName}, ${formatCurrency(seat.price)}`
            : `Seat ${seat.id}, ${seat.category}, ${formatCurrency(seat.price)}`
      }
      title={`${seat.id} · ${seat.category} · ${formatCurrency(seat.price)}`}
      onClick={() => onSelect(seat.id)}
    >
      <span>{seat.label}</span>
      <small>{seat.price === 0 ? "Free" : `₹${seat.price}`}</small>
    </button>
  );
}

export default function SeatMap({
  layout,
  inventory,
  passengers,
  ownerMap,
  selectedPassengerId,
  onSeatClick,
}) {
  return (
    <section className="panel aircraft-panel" aria-labelledby="aircraft-heading">
      <div className="panel-heading aircraft-heading">
        <div>
          <h2 id="aircraft-heading">{layout.label} aircraft</h2>
        </div>
        <div className="seat-legend" aria-label="Seat legend">
          <span><i className="legend-dot available" />Available</span>
          <span><i className="legend-dot selected" />Selected</span>
          <span><i className="legend-dot occupied" />Occupied</span>
          <span><i className="legend-dot premium" />Paid</span>
        </div>
      </div>

      <div className="aircraft-scroll">
        <div className="cabin-shell">
          <div className="cabin-front" aria-hidden="true"><span>Front</span></div>
          <div className={`seat-grid layout-${layout.id.replaceAll("-", "")}`}>
          {Array.from({ length: layout.rowCount }, (_, index) => index + 1).map((row) => (
            <div className="seat-row" key={row}>
              <span className="row-number">{row}</span>
              {layout.groups.map((group, groupIndex) => (
                <div className="seat-group" key={group.id}>
                  {groupIndex > 0 && <span className="aisle" aria-hidden="true" />}
                  {group.letters.map((letter) => {
                    const seat = inventory[`${row}${letter}`];
                    const ownerId = ownerMap.get(seat.id);
                    const owner = passengers.find((passenger) => passenger.id === ownerId);
                    return (
                      <SeatButton
                        key={seat.id}
                        seat={seat}
                        ownerId={ownerId}
                        ownerName={owner?.name}
                        selectedPassengerId={selectedPassengerId}
                        onSelect={onSeatClick}
                      />
                    );
                  })}
                </div>
              ))}
            </div>
          ))}
          </div>
          <div className="cabin-exit" aria-hidden="true"><span>Exit</span></div>
        </div>
      </div>
    </section>
  );
}
