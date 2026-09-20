"use client";
import Link from "next/link";
import { useDemo } from "@/demo/demo-provider";
import { PageHeading, RoleGate, Notice } from "@/components/shared/common";
import { Button } from "@/components/ui/button";
import { balance, paid } from "@/domain/selectors";
import { money } from "@/domain/money";
import { dateTime } from "@/domain/time";
export function Roster() {
  const { state } = useDemo();
  const offers = state.agreements.filter(
    (a) =>
      a.kind === "merchant" &&
      a.allocation === "confirmed" &&
      a.status === "confirmed",
  );
  return (
    <RoleGate roles={["organizer"]}>
      <div className="container">
        <PageHeading
          eyebrow={state.event.name}
          title="Ready for market day."
          description={`${offers.length} confirmed merchants · Setup ${dateTime(state.event.setup)}`}
          action={
            <Button onClick={() => window.print()}>Print private roster</Button>
          }
        />
        <Notice>
          Private organizer roster. Only confirmed active allocations appear.
          Cancellation history and refunds remain in the application records.
        </Notice>
        {!offers.length ? (
          <div className="empty">
            <h2>No confirmed merchants yet</h2>
            <p>
              Verify required receipts for accepted offers to build the roster.
            </p>
            <Link href="/organizer/events/makers-market-2026/applications">
              Review applications →
            </Link>
          </div>
        ) : (
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th>Merchant / contact</th>
                  <th>Booths</th>
                  <th>Requirements</th>
                  <th>Verified</th>
                  <th>Remaining</th>
                </tr>
              </thead>
              <tbody>
                {offers.map((a) => {
                  const app = state.applications.find(
                    (x) => x.id === a.parentId,
                  )!;
                  return (
                    <tr key={a.id}>
                      <td>
                        <Link
                          href={`/organizer/events/makers-market-2026/applications?application=${app.id}`}
                        >
                          {a.payerName}
                        </Link>
                        <br />
                        <small>{app.snapshots.at(-1)?.data.contact}</small>
                      </td>
                      <td>{a.boothIds.join(" + ")}</td>
                      <td>{app.snapshots.at(-1)?.data.needs}</td>
                      <td>{money(paid(state, a.id))}</td>
                      <td>
                        {money(balance(state, a))}
                        <br />
                        <small>
                          {balance(state, a) > 0
                            ? dateTime(a.terms.balanceDue)
                            : "Fully paid"}
                        </small>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
        <p className="small" style={{ marginTop: 24 }}>
          Sample setup instructions: arrive during agreed access, keep exits and
          walkway clear, follow the venue equipment limits.
        </p>
      </div>
    </RoleGate>
  );
}
