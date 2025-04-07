import { z } from "zod";

const Schema1 = z.array(z.string());
const Schema2 = Schema1.nonempty();
const Schema3 = z.array(z.number()).nonempty();