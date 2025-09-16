import type { Language } from "./types";

// prettier-ignore
const language: Language = {
	code: "gr",
	schema: (issue) =>
		`Λάθος τύπος: Αναμενόταν ${issue.expected} αλλά ήρθε ${issue.received}`,
	specific: {
		base64: (issue) => `Λάθος Base64: Ήρθε ${issue.received}`,
		bic: (issue) => `Λάθος BIC: Ήρθε ${issue.received}`,
		bytes: (issue) =>
			`Λάθος bytes: Αναμενόταν ${issue.expected} αλλά ήρθε ${issue.received}`,
		check: (issue) => `Λάθος input: Ήρθε ${issue.received}`,
		checkAsync: (issue) => `Λάθος input: Ήρθε ${issue.received}`,
		checkItems: (issue) => `Λάθος αντικείμενο: Ήρθε ${issue.received}`,
		checkItemsAsync: (issue) => `Λάθος αντικείμενο: Ήρθε ${issue.received}`,
		creditCard: (issue) => `Λάθος πιστωτική κάρτα: Ήρθε ${issue.received}`,
		cuid2: (issue) => `Λάθος Cuid2: Ήρθε ${issue.received}`,
		decimal: (issue) => `Λάθος δεκαδικός: Ήρθε ${issue.received}`,
		digits: (issue) => `Λάθος ψηφία: Ήρθε ${issue.received}`,
		email: (issue) => `Λάθος email: Ήρθε ${issue.received}`,
		emoji: (issue) => `Λάθος emoji: Ήρθε ${issue.received}`,
		empty: (issue) =>
			`Λάθος μέγεθος: Αναμενόταν ${issue.expected} αλλά ήρθε ${issue.received}`,
		endsWith: (issue) =>
			`Λάθος τέλος: Αναμενόταν ${issue.expected} αλλά ήρθε ${issue.received}`,
		everyItem: (issue) => `Λάθος αντικείμενο: Ήρθε ${issue.received}`,
		excludes: (issue) =>
			`Λάθος περιεχόμενο: Αναμενόταν ${issue.expected} αλλά ήρθε ${issue.received}`,
		finite: (issue) => `Λάθος μετρήσιμος: Ήρθε ${issue.received}`,
		graphemes: (issue) =>
			`Λάθος graphemes: Αναμενόταν ${issue.expected} αλλά ήρθε ${issue.received}`,
		hash: (issue) => `Λάθος hash: Ήρθε ${issue.received}`,
		hexColor: (issue) => `Λάθος hex χρώμα: Ήρθε ${issue.received}`,
		hexadecimal: (issue) => `Λάθος δεκαεξαδικός: Ήρθε ${issue.received}`,
		imei: (issue) => `Λάθος IMEI: Ήρθε ${issue.received}`,
		includes: (issue) =>
			`Λάθος περιεχόμενο: Αναμενόταν ${issue.expected} αλλά ήρθε ${issue.received}`,
		integer: (issue) => `Λάθος αριθμός: Ήρθε ${issue.received}`,
		ip: (issue) => `Λάθος IP: Ήρθε ${issue.received}`,
		ipv4: (issue) => `Λάθος IPv4: Ήρθε ${issue.received}`,
		ipv6: (issue) => `Λάθος IPv6: Ήρθε ${issue.received}`,
		isoDate: (issue) => `Λάθος ημερομηνία: Ήρθε ${issue.received}`,
		isoDateTime: (issue) => `Λάθος ημερομηνία-ώρα: Ήρθε ${issue.received}`,
		isoTime: (issue) => `Λάθος ώρα: Ήρθε ${issue.received}`,
		isoTimeSecond: (issue) => `Λάθος ώρα δευτερόλεπτο: Ήρθε ${issue.received}`,
		isoTimestamp: (issue) => `Λάθος χρονοσήμανση: Ήρθε ${issue.received}`,
		isoWeek: (issue) => `Λάθος εβδομάδα: Ήρθε ${issue.received}`,
		length: (issue) =>
			`Λάθος μάκρος: Αναμενόταν ${issue.expected} αλλά ήρθε ${issue.received}`,
		mac: (issue) => `Λάθος MAC: Ήρθε ${issue.received}`,
		mac48: (issue) => `Λάθος 48-bit MAC: Ήρθε ${issue.received}`,
		mac64: (issue) => `Λάθος 64-bit MAC: Ήρθε ${issue.received}`,
		maxBytes: (issue) =>
			`Λάθος bytes: Αναμενόταν ${issue.expected} αλλά ήρθε ${issue.received}`,
		maxGraphemes: (issue) =>
			`Λάθος graphemes: Αναμενόταν ${issue.expected} αλλά ήρθε ${issue.received}`,
		maxLength: (issue) =>
			`Λάθος μάκρος: Αναμενόταν ${issue.expected} αλλά ήρθε ${issue.received}`,
		maxSize: (issue) =>
			`Λάθος μέγεθος: Αναμενόταν ${issue.expected} αλλά ήρθε ${issue.received}`,
		maxValue: (issue) =>
			`Λάθος αξία: Αναμενόταν ${issue.expected} αλλά ήρθε ${issue.received}`,
		maxWords: (issue) =>
			`Λάθος λέξεις: Αναμενόταν ${issue.expected} αλλά ήρθε ${issue.received}`,
		mimeType: (issue) =>
			`Λάθος τύπος MIME: Αναμενόταν ${issue.expected} αλλά ήρθε ${issue.received}`,
		minBytes: (issue) =>
			`Λάθος bytes: Αναμενόταν ${issue.expected} αλλά ήρθε ${issue.received}`,
		minGraphemes: (issue) =>
			`Λάθος graphemes: Αναμενόταν ${issue.expected} αλλά ήρθε ${issue.received}`,
		minLength: (issue) =>
			`Λάθος μέγεθος: Αναμενόταν ${issue.expected} αλλά ήρθε ${issue.received}`,
		minSize: (issue) =>
			`Λάθος μέγεθος: Αναμενόταν ${issue.expected} αλλά ήρθε ${issue.received}`,
		minValue: (issue) =>
			`Λάθος αξία: Αναμενόταν ${issue.expected} αλλά ήρθε ${issue.received}`,
		minWords: (issue) =>
			`Λάθος λέξεις: Αναμενόταν ${issue.expected} αλλά ήρθε ${issue.received}`,
		multipleOf: (issue) =>
			`Λάθος multiple: Αναμενόταν ${issue.expected} αλλά ήρθε ${issue.received}`,
		nanoid: (issue) => `Λάθος Nano ID: Ήρθε ${issue.received}`,
		nonEmpty: (issue) =>
			`Λάθος μάκρος: Αναμενόταν ${issue.expected} αλλά ήρθε ${issue.received}`,
		notBytes: (issue) =>
			`Λάθος bytes: Αναμενόταν ${issue.expected} αλλά ήρθε ${issue.received}`,
		notGraphemes: (issue) =>
			`Λάθος graphemes: Αναμενόταν ${issue.expected} αλλά ήρθε ${issue.received}`,
		notLength: (issue) =>
			`Λάθος μάκρος: Αναμενόταν ${issue.expected} αλλά ήρθε ${issue.received}`,
		notSize: (issue) =>
			`Λάθος μέγεθος: Αναμενόταν ${issue.expected} αλλά ήρθε ${issue.received}`,
		notValue: (issue) =>
			`Λάθος αξία: Αναμενόταν ${issue.expected} αλλά ήρθε ${issue.received}`,
		notWords: (issue) =>
			`Λάθος λέξεις: Αναμενόταν ${issue.expected} αλλά ήρθε ${issue.received}`,
		octal: (issue) => `Λάθος octal: Ήρθε ${issue.received}`,
		partialCheck: (issue) => `Λάθος input: Ήρθε ${issue.received}`,
		regex: (issue) =>
			`Λάθος format: Αναμενόταν ${issue.expected} αλλά ήρθε ${issue.received}`,
		safeInteger: (issue) => `Λάθος safe integer: Ήρθε ${issue.received}`,
		size: (issue) =>
			`Λάθος μέγεθος: Αναμενόταν ${issue.expected} αλλά ήρθε ${issue.received}`,
		someItem: (issue) => `Λάθος αντικείμενο: Ήρθε ${issue.received}`,
		startsWith: (issue) =>
			`Λάθος start: Αναμενόταν ${issue.expected} αλλά ήρθε ${issue.received}`,
		ulid: (issue) => `Λάθος ULID: Ήρθε ${issue.received}`,
		url: (issue) => `Λάθος URL: Ήρθε ${issue.received}`,
		uuid: (issue) => `Λάθος UUID: Ήρθε ${issue.received}`,
		value: (issue) =>
			`Λάθος αξία: Αναμενόταν ${issue.expected} αλλά ήρθε ${issue.received}`,
		words: (issue) =>
			`Λάθος λέξεις: Αναμενόταν ${issue.expected} αλλά ήρθε ${issue.received}`,
	},
};

export default language;
