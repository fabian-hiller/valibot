import { z } from "zod";

const Schema1 = z.object({name: z.string(), age: z.number()}).passthrough();
const Schema2 = z.object({name: z.string(), age: z.number()});
const Schema3 = Schema2.passthrough();