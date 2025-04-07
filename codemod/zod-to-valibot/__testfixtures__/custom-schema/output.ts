import * as v from "valibot";

const Schema1 = v.custom<`${number}px`>((val) => {
	return typeof val === "string" ? /^\d+px$/.test(val) : false;
});
const Schema2 = v.custom<{value: string}>(() => true);