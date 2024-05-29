import * as v from "valibot";
import { email } from "valibot";

const Schema1 = v.pipe(v.string(), email());

const Schema2 = v.pipe(v.string("asd"), email());

const Schema3 = v.pipe(v.string("asd", "123"), email());
