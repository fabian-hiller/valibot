import * as v from "valibot";
import { email } from "valibot";

const Schema1 = v.string([email()]);

const Schema2 = v.string("asd", [email()]);

const Schema3 = v.string("asd", "123", [email()]);
