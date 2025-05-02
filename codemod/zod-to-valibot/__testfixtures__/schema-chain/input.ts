import { z } from "zod";

const Schema1 = z.string().trim().email();
const output1 = z.string().parse("valibot@example.com");
const output2 = z.string().trim().email().parse("valibot@example.com");
const Schema3 = z.string().optional();
const Schema4 = z.string().optional().nullable();
const Schema5 = z.string().email().optional();
const Schema6 = z.string().email().optional().nullable();