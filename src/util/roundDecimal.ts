export default function roundDecimal(
	num: number,
	decimalPlaces: number
): number {
	if (decimalPlaces < 1)
		throw new Error("Decimal places must be greater than 0");

	const factor = Math.pow(10, decimalPlaces);
	return Math.round(num * factor) / factor;
}
