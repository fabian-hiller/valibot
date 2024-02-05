import { isSchema } from '../../utils/isSchema.ts';
import type { ObjectEntries, ObjectSchema } from './object.ts';
import type { ObjectEntriesAsync, ObjectSchemaAsync } from './objectAsync.ts';

export const isObjectSchema = (
  val: unknown
): val is
  | ObjectSchema<ObjectEntries, any>
  | ObjectSchemaAsync<ObjectEntriesAsync, any> =>
  isSchema(val) && val.type === `object`;
