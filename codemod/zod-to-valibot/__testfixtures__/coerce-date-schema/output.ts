import * as v from "valibot";

const Schema1 = v.pipe(v.any(), v.transform((val) => {try { let res: Date; return isNaN((res = new Date(val)).valueOf()) ? val : res; } catch { return val; }}), v.date());
const Schema2 = v.pipe(v.any(), v.transform((val) => {try { let res: Date; return isNaN((res = new Date(val)).valueOf()) ? val : res; } catch { return val; }}), v.date());
const Schema3 = v.pipe(v.any(), v.transform((val) => {try { let res: Date; return isNaN((res = new Date(val)).valueOf()) ? val : res; } catch { return val; }}), v.date(), v.minValue(new Date("1/10/23")));
const Schema4 = v.pipe(v.any(), v.transform((val) => {try { let res: Date; return isNaN((res = new Date(val)).valueOf()) ? val : res; } catch { return val; }}), v.date(), v.maxValue(new Date("2023-01-10")));