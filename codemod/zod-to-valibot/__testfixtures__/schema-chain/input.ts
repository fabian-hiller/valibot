import { z } from "zod";

const Schema1 = z.string().trim().email();
const output1 = z.string().parse("valibot@example.com");
const output2 = z.string().trim().email().parse("valibot@example.com");