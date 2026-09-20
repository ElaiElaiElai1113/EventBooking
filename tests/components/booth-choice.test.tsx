import { afterEach, expect, it, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { createScene } from "@/demo/scenes";
import { BoothChoice } from "@/features/booths/booth-choice";
import type { Choice } from "@/domain/model";
vi.mock("@/demo/demo-provider", () => ({
  useDemo: () => ({ state: createScene("merchant-entry") }),
}));
afterEach(cleanup);
function Choices() {
  const [choices, setChoices] = useState<Choice[]>([]);
  return (
    <BoothChoice
      quantity={2}
      choices={choices}
      onQuantity={() => {}}
      onChoices={setChoices}
    />
  );
}
it("rejects a cross-row pair and keeps a valid keyboard-selected pair in the list", async () => {
  const user = userEvent.setup();
  render(<Choices />);
  await user.click(screen.getByRole("button", { name: "Booth 26" }));
  await user.click(screen.getByRole("button", { name: "Booth 27" }));
  await user.click(screen.getByRole("button", { name: "Add preference" }));
  expect(screen.getByRole("alert").textContent).toContain(
    "crosses the walkway",
  );
  screen.getByRole("button", { name: "Booth 30" }).focus();
  await user.keyboard("{Enter}");
  screen.getByRole("button", { name: "Booth 31" }).focus();
  await user.keyboard(" ");
  await user.click(screen.getByRole("tab", { name: "List" }));
  expect(
    screen
      .getByRole("button", { name: "Booth 30" })
      .getAttribute("aria-pressed"),
  ).toBe("true");
  await user.click(screen.getByRole("button", { name: "Add preference" }));
  expect(screen.getByText("1. Booths 30 + 31")).toBeTruthy();
  await user.click(screen.getByRole("button", { name: "Remove preference 1" }));
  expect(screen.getByText("No preferences yet.")).toBeTruthy();
});
