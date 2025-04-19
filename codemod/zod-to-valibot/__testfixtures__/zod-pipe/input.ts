import { z } from "zod";

const Schema = z.string().transform((val) => val.length).pipe(z.number().min(12));