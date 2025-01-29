export default function capitalize<T extends string | null>(
	str?: T,
	allFirstLetters = false
) {
	if (!str) return null;

	if (!allFirstLetters) {
		return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
	} else {
		return str
			.split(" ")
			.map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
			.join(" ") as T;
	}
}
