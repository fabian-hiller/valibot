import { z } from "zod";

const Schema1 = z.record(z.number());
const Schema2 = z.record(z.string(), z.boolean());