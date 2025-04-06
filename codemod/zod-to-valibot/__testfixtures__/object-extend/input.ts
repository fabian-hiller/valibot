import { z } from "zod";

const Schema1 = z.object({foo: z.string()}).extend({bar: z.number()});

const Schema2 = z.object({foo: z.number()});
const Schema3 = Schema2.extend({bar: z.string()});

const Obj1 = {bar: z.boolean()};
const Schema5 = z.object({foo: z.bigint()}).extend(Obj1);

const Schema6 = z.object({foo: z.unknown()});
const Obj3 = {bar: z.null()};
const Schema7 = Schema6.extend(Obj3);
