import { z } from "zod";

const Schema1 = z.object({k1: z.string(), k2: z.number()}).catchall(z.null());
const Schema2 = z.object({k1: z.string(), k2: z.number()});
const Schema3 = Schema2.catchall(z.null());