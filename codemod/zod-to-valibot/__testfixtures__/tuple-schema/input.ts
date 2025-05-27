import { z } from "zod";

const Schema1 = z.tuple([z.string(), z.number(), z.boolean()]);
const Schema2 = z.tuple([z.string(), z.number(), z.boolean()]).rest(z.bigint());
