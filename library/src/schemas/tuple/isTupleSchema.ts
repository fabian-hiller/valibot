import { isSchema } from '../../utils/isSchema.ts';
import type { TupleItems, TupleSchema } from './tuple.ts';
import type { TupleItemsAsync, TupleSchemaAsync } from './tupleAsync.ts';

export const isTupleSchema = (
  val: unknown
): val is
  | TupleSchema<TupleItems, any>
  | TupleSchemaAsync<TupleItemsAsync, any> =>
  isSchema(val) && val.type === `tuple`;
