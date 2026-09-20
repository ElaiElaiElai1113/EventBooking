import { expect, it } from "vitest";
import { createFixture } from "@/demo/fixtures";
it("contains exact inventory, businesses, and separate access intervals", () => {
  const s = createFixture();
  expect(s.venues).toHaveLength(3);
  expect(s.event.booths.map((b) => b.id)).toEqual(
    Array.from({ length: 12 }, (_, i) => String(21 + i)),
  );
  expect(s.event.pairs).toHaveLength(10);
  expect(s.event.pairs).not.toContainEqual(["26", "27"]);
  expect(s.profiles).toHaveLength(8);
  expect(s.applications.filter((a) => a.status === "submitted")).toHaveLength(
    7,
  );
  expect(s.applications.find((a) => a.id === "paper-and-clay")?.status).toBe(
    "draft",
  );
  expect(s.bookings[0].draft.accessEnd < s.bookings[1].draft.accessStart).toBe(
    true,
  );
});
