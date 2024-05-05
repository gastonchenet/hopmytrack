export default function roundDecimal(
  num: number,
  decimalPlaces: number
): number {
  const factor = Math.pow(10, decimalPlaces);
  return Math.round(num * factor) / factor;
}
