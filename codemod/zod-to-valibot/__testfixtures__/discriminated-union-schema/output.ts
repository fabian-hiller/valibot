import * as v from "valibot";

const ResultSchema = v.variant("status", [
	v.object({ status: v.literal("success"), data: v.string() }),
	v.object({ status: v.literal("failed"), error: v.instance(Error) }),
]);

const StateSchema = v.variant("status", [...ResultSchema.options, v.object({status: v.literal("loading")})]);