import {
  looseObject,
  looseTuple,
  never,
  object,
  strictObject,
  strictTuple,
  string,
  tuple,
  unknown,
} from 'valibot';

const LooseObjectSchema = looseObject({ key: string() });
const LooseTupleSchema = looseTuple([string()]);
const StrictObjectSchema = strictObject({ key: string() });
const StrictTupleSchema = strictTuple([string()]);
