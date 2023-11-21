import { TupleSchemaAsync, TupleItemsAsync } from './tupleAsync.ts';
import { TupleSchema, TupleItems } from './tuple.ts';
import { isSchema } from '../../utils/isSchema.ts';

export const isTupleSchema = (
  val: unknown
): val is
  | TupleSchema<TupleItems, any>
  | TupleSchemaAsync<TupleItemsAsync, any> =>
  isSchema(val) && val.type === `tuple`;
