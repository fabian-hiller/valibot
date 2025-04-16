import { z } from "zod";

// plain
const Schema1 = z.object({foo: z.string()}).merge(z.object({bar: z.number()}));
const Schema2 = z.object({foo: z.number()});
const Schema3 = Schema2.merge(z.object({bar: z.string()}));
const Schema4 = z.object({bar: z.number()});
const Schema5 = z.object({foo: z.string()}).merge(Schema4);
const Schema6 = Schema2.merge(Schema4);

// passthrough
const Schema7 = z.object({foo: z.string()}).merge(z.object({bar: z.number()}).passthrough());
const Schema8 = Schema2.merge(z.object({bar: z.string()}).passthrough());
const Schema9 = z.object({bar: z.number()}).passthrough();
const Schema10 = z.object({foo: z.string()}).merge(Schema9);
const Schema11 = Schema2.merge(Schema9);

// strict
const Schema12 = z.object({foo: z.string()}).merge(z.object({bar: z.number()}).strict());
const Schema13 = Schema2.merge(z.object({bar: z.string()}).strict());
const Schema14 = z.object({bar: z.number()}).strict();
const Schema15 = z.object({foo: z.string()}).merge(Schema14);
const Schema16 = Schema2.merge(Schema14);

// strict
const Schema17 = z.object({foo: z.string()}).merge(z.object({bar: z.number()}).strict().strip());
const Schema18 = Schema2.merge(z.object({bar: z.string()}).strict().strip());
const Schema19 = z.object({bar: z.number()}).strict().strip();
const Schema20 = z.object({foo: z.string()}).merge(Schema19);
const Schema21 = Schema2.merge(Schema19);

// catchall
const Schema22 = z.object({foo: z.string()}).merge(z.object({bar: z.number()}).catchall(z.null()));
const Schema23 = Schema2.merge(z.object({bar: z.string()}).catchall(z.null()));
const Schema24 = z.object({bar: z.number()}).catchall(z.null());
const Schema25 = z.object({foo: z.string()}).merge(Schema24);
const Schema26 = Schema2.merge(Schema24);