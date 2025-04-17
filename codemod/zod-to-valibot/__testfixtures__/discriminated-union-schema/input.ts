import { z } from "zod";

const ResultSchema = z.discriminatedUnion("status", [
  z.object({ status: z.literal("success"), data: z.number() }),
  z.object({ status: z.literal("failed"), error: z.string() }),
]);

const StateSchema = z.discriminatedUnion("status", [...ResultSchema.options, z.object({status: z.literal("loading")})]);