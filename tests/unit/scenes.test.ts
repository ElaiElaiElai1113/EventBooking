import { expect, it } from "vitest";
import { createScene, scenes } from "@/demo/scenes";
import { decode } from "@/demo/persistence";
it.each(scenes)(
  "scene %s has valid references and exclusive atomic allocations",
  (id) => {
    const s = createScene(id);
    expect(decode(JSON.stringify(s))).toEqual(s);
    const claims = s.agreements
      .filter((a) => a.kind === "merchant" && a.allocation !== "released")
      .flatMap((a) => a.boothIds);
    expect(new Set(claims).size).toBe(claims.length);
    for (const r of s.receipts)
      expect(s.agreements.some((a) => a.id === r.agreementId)).toBe(true);
    for (const a of s.agreements.filter((a) => a.status === "confirmed"))
      expect(a.acceptedAt).toBeTruthy();
  },
);
