import type { ObjectSchemaAsync, ObjectEntriesAsync } from './objectAsync.ts';
import type { ObjectSchema, ObjectEntries } from './object.ts';
import { isSchema } from '../../utils/isSchema.ts';

export const isObjectSchema = (
  val: unknown
): val is
  | ObjectSchema<ObjectEntries, any>
  | ObjectSchemaAsync<ObjectEntriesAsync, any> =>
  isSchema(val) && val.type === `object`;
