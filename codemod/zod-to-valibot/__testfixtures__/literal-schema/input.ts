import { z } from "zod";

const Schema1 = z.literal("valibot");
const Schema2 = z.literal(123);
const Schema3 = z.literal(Symbol("someSymbol"));
const Schema4 = z.literal(321n);
const Schema5 = z.literal(true);
const Schema6 = z.literal(null);
const Schema7 = z.literal(undefined);