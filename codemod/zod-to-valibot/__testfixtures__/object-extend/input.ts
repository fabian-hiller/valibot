import { z } from "zod";

// plain
const Schema1 = z.object({foo: z.string()}).extend({bar: z.number()});
const Schema2 = z.object({foo: z.number()});
const Schema3 = Schema2.extend({bar: z.string()});

// passthrough
const Schema4 = z.object({foo: z.string()}).passthrough().extend({bar: z.number()});
const Schema5 = z.object({foo: z.number()}).passthrough();
const Schema6 = Schema5.extend({bar: z.string()});
const Schema7 = z.object({foo: z.string()}).extend({bar: z.number()}).passthrough();
const Schema8 = Schema2.extend({bar: z.string()}).passthrough();

// strict
const Schema9 = z.object({foo: z.string()}).strict().extend({bar: z.number()});
const Schema10 = z.object({foo: z.number()}).strict();
const Schema11 = Schema10.extend({bar: z.string()});
const Schema12 = z.object({foo: z.string()}).extend({bar: z.number()}).strict();
const Schema13 = Schema2.extend({bar: z.string()}).strict();

// strip
const Schema14 = z.object({foo: z.string()}).strict().strip().extend({bar: z.number()});
const Schema15 = z.object({foo: z.number()}).strict().strip();
const Schema16 = Schema15.extend({bar: z.string()});
const Schema17 = z.object({foo: z.string()}).extend({bar: z.number()}).strict().strip();
const Schema18 = Schema2.extend({bar: z.string()}).strict().strip();

// catchall
const Schema19 = z.object({foo: z.string()}).catchall(z.null()).extend({bar: z.number()});
const Schema20 = z.object({foo: z.number()}).catchall(z.null());
const Schema21 = Schema20.extend({bar: z.string()});
const Schema22 = z.object({foo: z.string()}).extend({bar: z.number()}).catchall(z.null());
const Schema23 = Schema2.extend({bar: z.string()}).catchall(z.null());