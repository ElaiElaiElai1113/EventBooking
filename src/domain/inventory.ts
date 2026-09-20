import type { Choice } from "./model";
export function isEligibleChoice(choice: Choice, pairs: Choice[]): boolean {
  return (
    new Set(choice).size === choice.length &&
    (choice.length === 1 ||
      (choice.length === 2 &&
        pairs.some(
          (p) => p.length === 2 && p.every((id) => choice.includes(id)),
        )))
  );
}
export function intervalsOverlap(
  a: number,
  b: number,
  c: number,
  d: number,
): boolean {
  return a < d && c < b;
}
