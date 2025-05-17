import { z } from "zod";

const Schema1 = z.set(z.string()).nonempty();
const Schema2 = z.set(z.string()).min(5);
const Schema3 = z.set(z.string()).max(6);
const Schema4 = z.set(z.string()).size(7);