import { expect, it } from "vitest";
import { createFixture } from "@/demo/fixtures";
import { decode, save, STORAGE_KEY } from "@/demo/persistence";
it("round trips validated versioned records and rejects corrupt shapes", () => {
  const s = createFixture();
  expect(decode(JSON.stringify(s))).toEqual(s);
  expect(() => decode("{")).toThrow();
  expect(() => decode(JSON.stringify({ ...s, schemaVersion: 99 }))).toThrow();
  expect(() => decode(JSON.stringify({ ...s, event: {} }))).toThrow();
  expect(() =>
    decode(JSON.stringify({ ...s, receipts: [{ amount: "fake" }] })),
  ).toThrow();
});
it("reports save failure without discarding in-memory work", () => {
  const s = createFixture();
  const r = save(
    {
      setItem() {
        throw new Error("Quota exceeded");
      },
    },
    s,
  );
  expect(r.ok).toBe(false);
  expect(s.applications).toHaveLength(8);
  let key = "";
  expect(
    save(
      {
        setItem(k) {
          key = k;
        },
      },
      s,
    ).ok,
  ).toBe(true);
  expect(key).toBe(STORAGE_KEY);
});
