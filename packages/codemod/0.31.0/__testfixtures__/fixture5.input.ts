import { object, tuple, string, unknown, never } from "valibot";

const LooseObjectSchema = object({ key: string() }, unknown());
const LooseTupleSchema = tuple([string()], unknown());
const StrictObjectSchema = object({ key: string() }, never());
const StrictTupleSchema = tuple([string()], never());
