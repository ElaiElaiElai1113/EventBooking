export function money(amount: number) {
  return (
    "PHP " +
    (amount / 100).toLocaleString("en-PH", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
  );
}
export const pesos = (value: string) => Math.round(Number(value) * 100);
