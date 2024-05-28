import * as v from "valibot";
import { object, tuple } from "valibot";

const ObjectSchema = object({ key: v.string() }, v.null_());
const TupleSchema = tuple([v.string()], v.null_());
