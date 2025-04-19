import { z } from "zod";

const Schema1 = z.array(z.string()).readonly();
const Schema2 = z.tuple([z.string(), z.number()]).readonly();
const Schema3 = z.map(z.string(), z.date()).readonly();
const Schema4 = z.set(z.string()).min(3).readonly();
const Schema5 = z.object({key: z.string()}).readonly();