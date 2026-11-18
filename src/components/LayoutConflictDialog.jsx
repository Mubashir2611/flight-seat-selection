export default function LayoutConflictDialog({
  incompatible,
  destinationLabel,
  onConfirm,
  onCancel,
}) {
  if (!incompatible) return null;

  return (
    <div className="dialog-backdrop" role="presentation">
      <section
        className="dialog"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="layout-dialog-title"
        aria-describedby="layout-dialog-description"
      >
        <p className="eyebrow">Layout change</p>
        <h2 id="layout-dialog-title">Release incompatible seats?</h2>
        <p id="layout-dialog-description">
          Switching to {destinationLabel} does not contain:
        </p>
        <ul>
          {incompatible.map((item) => (
            <li key={`${item.passengerId}-${item.seatId}`}>
              {item.passengerName} — Seat {item.seatId}
            </li>
          ))}
        </ul>
        <p>Confirming will explicitly remove these seat assignments.</p>
        <div className="dialog-actions">
          <button type="button" className="secondary-button" onClick={onCancel}>
            Keep current layout
          </button>
          <button type="button" className="danger-button" onClick={onConfirm}>
            Release and switch
          </button>
        </div>
      </section>
    </div>
  );
}
