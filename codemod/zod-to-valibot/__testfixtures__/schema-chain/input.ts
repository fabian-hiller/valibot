import { z } from "zod";

const EmailSchema = z.string().trim().email();