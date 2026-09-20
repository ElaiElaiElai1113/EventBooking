import type { DemoState } from "./model";
import type { Command } from "./commands";
import { actor, requireRule } from "./validation";
import { applicationWindow } from "./time";
import { isEligibleChoice } from "./inventory";
import { boothState } from "./selectors";
export function applicationCommand(s: DemoState, c: Command): boolean {
  if (
    ![
      "saveApplication",
      "submitApplication",
      "saveProfile",
      "reviewApplication",
      "withdrawApplication",
    ].includes(c.type)
  )
    return false;
  if (c.type === "saveProfile") {
    actor(c, "merchant", c.id);
    const p = s.profiles.find((p) => p.id === c.id);
    requireRule(p && c.name.trim(), "PROFILE", "Enter the business name.");
    p.name = c.name;
    return true;
  }
  if (!("id" in c)) return false;
  const a = s.applications.find((a) => a.id === c.id);
  requireRule(a, "APPLICATION", "Application not found.");
  const live = s.agreements.some(
    (g) => g.parentId === a.id && g.allocation !== "released",
  );
  if (c.type === "reviewApplication") {
    actor(c, "organizer", "sample-market-team");
    requireRule(
      a.status !== "draft",
      "APPLICATION",
      "Drafts are private until submitted.",
    );
    if (c.decision === "note") a.notes = c.text;
    else if (c.decision === "shortlist") a.shortlisted = !a.shortlisted;
    else {
      requireRule(
        !live,
        "ACTIVE_OFFER",
        "Resolve the current offer before changing the application outcome.",
      );
      if (c.decision === "clarify") {
        requireRule(c.text.trim(), "QUESTION", "Write a specific question.");
        a.status = "clarification";
        a.correctionRequested = true;
        a.messages.push({
          id: `m-${s.revision}`,
          from: "organizer",
          text: c.text,
          at: s.now,
        });
      } else a.status = c.decision === "waitlist" ? "waitlisted" : "declined";
    }
    a.history.push(`${s.now}: Organizer ${c.decision}.`);
    return true;
  }
  actor(c, "merchant", a.businessId);
  if (c.type === "saveApplication") {
    requireRule(
      !live,
      "ACTIVE_OFFER",
      "An active offer preserves the submitted application. Ask the organizer about changes.",
    );
    a.draft = structuredClone(c.draft);
    return true;
  }
  if (c.type === "withdrawApplication") {
    requireRule(
      !live &&
        !s.receipts.some(
          (r) =>
            s.agreements.some(
              (g) => g.parentId === a.id && g.id === r.agreementId,
            ) && r.status !== "rejected",
        ),
      "REVIEW",
      "Recorded proof or allocation requires staff cancellation review.",
    );
    a.status = "withdrawn";
    a.history.push(`${s.now}: Application withdrawn.`);
    return true;
  }
  if (c.type === "submitApplication") {
    requireRule(
      s.event.status === "published",
      "PUBLICATION",
      "The event is not published.",
    );
    requireRule(
      applicationWindow(s.now, s.event.opens, s.event.closes) === "open" ||
        a.correctionRequested,
      "CLOSED",
      "Applications are closed. Only requested corrections can be submitted.",
    );
    requireRule(
      !live,
      "ACTIVE_OFFER",
      "Resolve the active offer before revising.",
    );
    const d = a.draft;
    requireRule(
      d.name.trim() &&
        d.contact.includes("@") &&
        d.category.trim() &&
        d.products.trim(),
      "FIELDS",
      "Complete business name, contact, category and products.",
    );
    requireRule(
      d.choices.length >= 1 && d.choices.length <= 3,
      "CHOICES",
      "Choose one to three ranked alternatives.",
    );
    requireRule(
      new Set(d.choices.map((p) => [...p].sort().join("-"))).size ===
        d.choices.length,
      "CHOICES",
      "Each ranked choice must be different.",
    );
    for (const p of d.choices) {
      requireRule(
        p.length === d.quantity && isEligibleChoice(p, s.event.pairs),
        "PAIR",
        "Choose one booth or an eligible pair. 26 + 27 crosses the walkway.",
      );
      requireRule(
        p.every(
          (id) =>
            s.event.booths.some((b) => b.id === id) &&
            boothState(s, id) === "Accepting preferences",
        ),
        "UNAVAILABLE",
        "A preference is unavailable. Keep your other choices and replace that preference.",
      );
      requireRule(
        !d.power ||
          p.some((id) =>
            s.event.booths.some(
              (b) => b.id === id && b.power && b.watts >= d.watts,
            ),
          ),
        "POWER",
        "Choose an option with sufficient power for your equipment.",
      );
    }
    const last = a.snapshots.at(-1);
    if (!last || JSON.stringify(last.data) !== JSON.stringify(d))
      a.snapshots.push({
        version: (last?.version ?? 0) + 1,
        at: s.now,
        data: structuredClone(d),
      });
    a.status = "submitted";
    a.correctionRequested = false;
    a.history.push(
      `${s.now}: Application submitted; no booth reserved or payment due.`,
    );
    return true;
  }
  return false;
}
