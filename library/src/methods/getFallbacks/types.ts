import type {
  ObjectEntries,
  ObjectEntriesAsync,
  ObjectSchema,
  ObjectSchemaAsync,
  TupleItems,
  TupleItemsAsync,
  TupleSchema,
  TupleSchemaAsync,
} from '../../schemas/index.ts';
import type { BaseSchema, BaseSchemaAsync } from '../../types/index.ts';
import type {
  FallbackValue,
  SchemaWithMaybeFallback,
  SchemaWithMaybeFallbackAsync,
} from '../getFallback/index.ts';

/**
 * Fallback values inference type.
 */
export type FallbackValues<
  TSchema extends
    | SchemaWithMaybeFallback<
        | BaseSchema
        | ObjectSchema<ObjectEntries, any>
        | TupleSchema<TupleItems, any>
      >
    | SchemaWithMaybeFallbackAsync<
        | BaseSchemaAsync
        | ObjectSchemaAsync<ObjectEntriesAsync, any>
        | TupleSchemaAsync<TupleItemsAsync, any>
      >
> = TSchema extends ObjectSchema<infer TEntries extends ObjectEntries>
  ? { [TKey in keyof TEntries]: FallbackValues<TEntries[TKey]> }
  : TSchema extends ObjectSchemaAsync<infer TEntries extends ObjectEntriesAsync>
  ? { [TKey in keyof TEntries]: FallbackValues<TEntries[TKey]> }
  : TSchema extends TupleSchema<infer TItems>
  ? { [TKey in keyof TItems]: FallbackValues<TItems[TKey]> }
  : TSchema extends TupleSchemaAsync<infer TItems>
  ? { [TKey in keyof TItems]: FallbackValues<TItems[TKey]> }
  : FallbackValue<TSchema>;
