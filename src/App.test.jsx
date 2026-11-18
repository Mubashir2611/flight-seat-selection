import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { act } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import App from "./App";

beforeEach(() => {
  window.localStorage.clear();
  delete document.documentElement.dataset.theme;
  delete document.documentElement.dataset.themePreference;
  document.documentElement.style.colorScheme = "";
});

describe("App", () => {
  it("renders the complete booking workspace", () => {
    render(<App />);

    expect(
      screen.getByRole("heading", { name: "Choose your seats" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Passengers" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "3-2 aircraft" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Summary" })).toBeInTheDocument();
  });

  it("assigns a seat and updates the summary", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole("button", { name: /Seat 1A/ }));

    expect(
      screen.getByText("Passenger 1 assigned to 1A."),
    ).toBeInTheDocument();
    expect(screen.getAllByText(/1A/).length).toBeGreaterThan(0);
  });

  it("requires confirmation before releasing incompatible layout assignments", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole("button", { name: /Seat 1C/ }));
    await user.click(screen.getByRole("button", { name: "2-3-2" }));

    expect(
      screen.getByRole("heading", { name: "Release incompatible seats?" }),
    ).toBeInTheDocument();
    expect(screen.getByText(/Passenger 1 — Seat 1C/)).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Keep current layout" }));
    expect(screen.getByRole("heading", { name: "3-2 aircraft" })).toBeInTheDocument();
  });

  it("defaults to the system theme", () => {
    window.matchMedia = vi.fn().mockReturnValue({
      matches: false,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    });

    render(<App />);

    expect(document.documentElement.dataset.theme).toBe("light");
    expect(document.documentElement.dataset.themePreference).toBe("system");
    expect(screen.getByRole("button", { name: "System theme" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
  });

  it("switches between light and dark themes", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole("button", { name: "Dark theme" }));
    expect(document.documentElement.dataset.theme).toBe("dark");
    expect(document.documentElement.dataset.themePreference).toBe("dark");
    expect(window.localStorage.getItem("flight-seat-theme")).toBe("dark");

    await user.click(screen.getByRole("button", { name: "Light theme" }));
    expect(document.documentElement.dataset.theme).toBe("light");
    expect(window.localStorage.getItem("flight-seat-theme")).toBe("light");
  });

  it("persists the selected theme preference", () => {
    window.localStorage.setItem("flight-seat-theme", "dark");

    render(<App />);

    expect(document.documentElement.dataset.theme).toBe("dark");
    expect(screen.getByRole("button", { name: "Dark theme" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
  });

  it("returns to system theme and follows system changes", async () => {
    let mediaChangeHandler;
    window.matchMedia = vi.fn().mockReturnValue({
      matches: false,
      addEventListener: vi.fn((eventName, handler) => {
        if (eventName === "change") mediaChangeHandler = handler;
      }),
      removeEventListener: vi.fn(),
    });
    window.localStorage.setItem("flight-seat-theme", "dark");
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole("button", { name: "System theme" }));
    expect(document.documentElement.dataset.theme).toBe("light");

    act(() => mediaChangeHandler?.({ matches: true }));
    expect(document.documentElement.dataset.theme).toBe("dark");
  });

  it("allows independent meal selections for every passenger", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.selectOptions(
      screen.getByLabelText("Meal for Passenger 1"),
      "chicken",
    );
    await user.selectOptions(
      screen.getByLabelText("Meal for Passenger 2"),
      "vegetarian",
    );

    expect(
      screen.getByText("Meal updated for Passenger 2."),
    ).toBeInTheDocument();
    expect(screen.getAllByText(/Chicken meal/).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Vegetarian meal/).length).toBeGreaterThan(0);
  });

  it("switches passengers and preserves separate seat assignments", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole("button", { name: /Seat 1A/ }));
    await user.click(screen.getByRole("button", { name: /Passenger 2/ }));
    await user.click(screen.getByRole("button", { name: /Seat 1B/ }));

    expect(screen.getByText("Passenger 2 assigned to 1B.")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Select Passenger 1" }));
    expect(screen.getByText("Passenger 1 is assigned to 1A.")).toBeInTheDocument();
  });

  it("changes passenger count and keeps the passenger list usable", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole("button", { name: "Add one passenger" }));
    expect(screen.getAllByText("Passenger 3").length).toBeGreaterThan(0);

    await user.click(screen.getByRole("button", { name: "Remove one passenger" }));
    expect(screen.queryByText("Passenger 3")).not.toBeInTheDocument();
  });

  it("removes a seat and disables occupied and other-passenger seats", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole("button", { name: /Seat 1A/ }));
    await user.click(screen.getByRole("button", { name: "Remove seat" }));
    expect(screen.getByText("Seat assignment removed.")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /Seat 1A/ }));
    await user.click(screen.getByRole("button", { name: /Passenger 2/ }));
    expect(
      screen.getByRole("button", { name: /Seat 1A, assigned to Passenger 1/ }),
    ).toBeDisabled();
    expect(
      screen.getByRole("button", { name: /Seat 2C, occupied/ }),
    ).toBeDisabled();
  });

  it("switches to 2-3-2 and can confirm compatible layout changes", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole("button", { name: "2-3-2" }));
    expect(
      screen.getByRole("heading", { name: "2-3-2 aircraft" }),
    ).toBeInTheDocument();
  });
});
