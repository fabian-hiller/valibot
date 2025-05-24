import { z } from "zod";

const Schema1 = z.custom<`${number}px`>((val) => {
  return typeof val === "string" ? /^\d+px$/.test(val) : false;
});
const Schema2 = z.custom<{value: string}>();