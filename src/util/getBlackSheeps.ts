import lookup from "../lookup";

export default async function getBlackSheeps() {
	return await lookup(
		{
			username: [...Array(16)]
				.map(() => Math.floor(Math.random() * 16).toString(16))
				.join(""),
		},
		{ depth: 1, log: false, derivateUsername: false }
	);
}
