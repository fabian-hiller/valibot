import { z } from "zod";

const MinSchema = z.date().min(new Date("2025-04-04"));
const MaxSchema = z.date().max(new Date("1999-02-03"));
const CoercedMinSchema = z.coerce.date().min(new Date("2020-01-05"));
const CoercedMaxSchema = z.coerce.date().max(new Date("2011-06-07"));