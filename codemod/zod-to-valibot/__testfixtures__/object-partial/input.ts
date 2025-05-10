import { z } from "zod";

// make all keys optional
const Schema1 = z.object({k1: z.string(), k2: z.number(), k3: z.boolean()});
const Schema2 = Schema1.partial();
const Schema3 = z.object({k1: z.string(), k2: z.number(), k3: z.boolean()}).partial();

// make some keys optional
const Schema4 = z.object({k1: z.string(), k2: z.number(), k3: z.boolean()});
const Schema5 = Schema4.partial({k1: true, k3: true});
const Schema6 = z.object({k1: z.string(), k2: z.number(), k3: z.boolean()}).partial({k2: true});
