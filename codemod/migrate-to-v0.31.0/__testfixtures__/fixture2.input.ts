import * as v from 'valibot';
import { type BaseSchema, toCustom } from 'valibot';

v.custom();
BaseSchema();
v.Input();
v.Output();
v.special();
toCustom();
toTrimmed();
v.toTrimmedEnd();
v.toTrimmedStart();
