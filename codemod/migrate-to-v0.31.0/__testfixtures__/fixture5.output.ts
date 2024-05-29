import {
  string,
  strictTuple,
  strictObject,
  looseTuple,
  looseObject,
} from "valibot";

const LooseObjectSchema = looseObject({ key: string() });
const LooseTupleSchema = looseTuple([string()]);
const StrictObjectSchema = strictObject({ key: string() });
const StrictTupleSchema = strictTuple([string()]);
