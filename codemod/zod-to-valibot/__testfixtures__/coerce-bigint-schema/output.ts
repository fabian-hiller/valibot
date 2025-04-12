import * as v from "valibot";

const Schema1 = v.pipe(v.any(), v.transform((val) => {try { return BigInt(val); } catch { return val; }}), v.bigint());
const Schema2 = v.pipe(v.any(), v.transform((val) => {try { return BigInt(val); } catch { return val; }}), v.bigint());
const Schema3 = v.pipe(v.any(), v.transform((val) => {try { return BigInt(val); } catch { return val; }}), v.bigint(), v.gtValue(1n));
const Schema4 = v.pipe(v.any(), v.transform((val) => {try { return BigInt(val); } catch { return val; }}), v.bigint(), v.ltValue(2n));