import { z } from "zod";

// simple cases
const Schema1 = z.array(z.string());
const Schema2 = z.string().array();

// chains
const Schema3 = z.string().email().array();
const Schema4 = z.string().length(7).optional().array();
const Schema5 = z.string().length(12).array().optional();