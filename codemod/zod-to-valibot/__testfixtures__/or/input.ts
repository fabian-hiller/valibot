import { z } from "zod";

const Schema1 = z.string().or(z.number());