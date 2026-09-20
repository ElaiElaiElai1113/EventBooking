export const HOUR = 3600000;
export const stamp = (value: string) => Date.parse(value);
export const afterHours = (value: string, hours: number) =>
  new Date(stamp(value) + hours * HOUR).toISOString();
export function applicationWindow(now: string, opens: string, closes: string) {
  return stamp(now) < stamp(opens)
    ? "upcoming"
    : stamp(now) < stamp(closes)
      ? "open"
      : "closed";
}
export function dateTime(value: string) {
  return (
    new Intl.DateTimeFormat("en-PH", {
      timeZone: "Asia/Manila",
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    }).format(new Date(value)) + " PHT"
  );
}
export function localInput(value: string) {
  return new Date(stamp(value) + 8 * HOUR).toISOString().slice(0, 16);
}
export function fromInput(value: string) {
  return value ? value + ":00+08:00" : "";
}
