import { z } from "zod";

const ResultSchema = z.discriminatedUnion("status", [
  z.object({ status: z.literal("success"), data: z.string() }),
  z.object({ status: z.literal("failed"), error: z.instanceof(Error) }),
]);

const StateSchema = z.discriminatedUnion("status", [...ResultSchema.options, z.object({status: z.literal("loading")})]);