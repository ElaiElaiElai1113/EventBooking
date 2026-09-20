import { expect, it } from "vitest";
import { isEligibleChoice, intervalsOverlap } from "@/domain/inventory";
it("uses explicit physical adjacency, rejects duplicates and wrong quantities", () => {
  const pairs = [
    ["23", "24"],
    ["30", "31"],
  ];
  expect(isEligibleChoice(["24", "23"], pairs)).toBe(true);
  expect(isEligibleChoice(["26", "27"], pairs)).toBe(false);
  expect(isEligibleChoice(["23", "23"], pairs)).toBe(false);
  expect(isEligibleChoice([], pairs)).toBe(false);
  expect(isEligibleChoice(["23", "24", "25"], pairs)).toBe(false);
});
it("includes setup and cleanup while permitting touching endpoints", () => {
  expect(intervalsOverlap(9, 19, 18, 20)).toBe(true);
  expect(intervalsOverlap(9, 19, 19, 22)).toBe(false);
});
