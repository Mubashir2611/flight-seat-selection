import BookingHeader from "./components/BookingHeader";
import BookingSummary from "./components/BookingSummary";
import LayoutConflictDialog from "./components/LayoutConflictDialog";
import PassengerPanel from "./components/PassengerPanel";
import SeatMap from "./components/SeatMap";
import { useFlightSelection } from "./hooks/useFlightSelection";
import { useTheme } from "./hooks/useTheme";

export default function App() {
  const booking = useFlightSelection();
  const theme = useTheme();

  return (
    <main className="app-shell">
      <BookingHeader
        passengerCount={booking.passengers.length}
        layoutId={booking.layoutId}
        onPassengerCountChange={booking.setPassengerCount}
        onLayoutChange={booking.requestLayoutSwitch}
        themePreference={theme.preference}
        onThemeChange={theme.setPreference}
      />

      <div className="booking-status" role="status" aria-live="polite">
        {booking.statusMessage}
      </div>

      <div className="booking-layout">
        <PassengerPanel
          passengers={booking.passengers}
          selectedPassengerId={booking.selectedPassengerId}
          inventory={booking.inventory}
          onSelectPassenger={booking.selectPassenger}
          onUpdateName={booking.updatePassengerName}
          onRemoveSeat={booking.removeSeat}
          onSelectMeal={booking.selectMeal}
        />

        <SeatMap
          layout={booking.layout}
          inventory={booking.inventory}
          passengers={booking.passengers}
          ownerMap={booking.ownerMap}
          selectedPassengerId={booking.selectedPassengerId}
          onSeatClick={booking.assignSelectedSeat}
        />

        <BookingSummary
          passengers={booking.passengers}
          inventory={booking.inventory}
          totals={booking.totals}
        />
      </div>

      {booking.pendingLayoutId && (
        <LayoutConflictDialog
          incompatible={booking.pendingIncompatible}
          destinationLabel={booking.pendingLayoutId}
          onConfirm={booking.confirmPendingLayoutSwitch}
          onCancel={booking.cancelPendingLayoutSwitch}
        />
      )}
    </main>
  );
}