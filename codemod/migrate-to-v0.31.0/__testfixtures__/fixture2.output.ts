import * as v from 'valibot';
import { type GenericSchema, transform } from 'valibot';

v.check();
GenericSchema();
v.InferInput();
v.InferOutput();
v.custom();
transform();
toTrimmed();
v.trimEnd();
v.trimStart();
