import { AIRCRAFT_LAYOUTS } from "../data/aircraftLayouts";
import { MAX_PASSENGERS, MIN_PASSENGERS } from "../domain/passengerRules";

export default function BookingHeader({
  passengerCount,
  layoutId,
  onPassengerCountChange,
  onLayoutChange,
  themePreference,
  onThemeChange,
}) {
  return (
    <header className="booking-header">
      <div className="flight-brand">
        <div className="brand-mark" aria-hidden="true">✦</div>
        <div>
          <p className="eyebrow">SkyWays · Booking BN-204</p>
          <h1>Choose your seats</h1>
        </div>
      </div>

      <div className="flight-route" aria-label="Flight route London to Dubai">
        <div className="route-city">
          <strong>LHR</strong>
          <span>London</span>
        </div>
        <div className="route-line" aria-hidden="true">
          <span className="route-dot"></span>
          <span className="route-plane">✈</span>
          <span className="route-dot"></span>
        </div>
        <div className="route-city route-city-right">
          <strong>DXB</strong>
          <span>Dubai</span>
        </div>
      </div>

      <div className="flight-controls">
        <fieldset className="theme-control">
          <legend>Theme</legend>
          <div className="theme-options" aria-label="Color theme">
            {[
              { value: "system", label: "System", icon: "◐" },
              { value: "light", label: "Light", icon: "☀" },
              { value: "dark", label: "Dark", icon: "☾" },
            ].map((option) => (
              <button
                type="button"
                key={option.value}
                className={themePreference === option.value ? "active" : ""}
                aria-label={`${option.label} theme`}
                aria-pressed={themePreference === option.value}
                title={`${option.label} theme`}
                onClick={() => onThemeChange(option.value)}
              >
                <span aria-hidden="true">{option.icon}</span>
                <span className="theme-option-label">{option.label}</span>
              </button>
            ))}
          </div>
        </fieldset>

        <fieldset className="passenger-control">
          <legend>Travellers</legend>
          <div className="stepper">
            <button type="button" aria-label="Remove one passenger" disabled={passengerCount <= MIN_PASSENGERS} onClick={() => onPassengerCountChange(passengerCount - 1)}>−</button>
            <output aria-live="polite">{passengerCount}</output>
            <button type="button" aria-label="Add one passenger" disabled={passengerCount >= MAX_PASSENGERS} onClick={() => onPassengerCountChange(passengerCount + 1)}>+</button>
          </div>
        </fieldset>

        <fieldset className="layout-control">
          <legend>Aircraft layout</legend>
          <div className="segmented-control">
            {Object.values(AIRCRAFT_LAYOUTS).map((layout) => (
              <button
                type="button"
                key={layout.id}
                className={layoutId === layout.id ? "active" : ""}
                aria-pressed={layoutId === layout.id}
                onClick={() => onLayoutChange(layout.id)}
              >
                {layout.label}
              </button>
            ))}
          </div>
        </fieldset>
      </div>
    </header>
  );
}
