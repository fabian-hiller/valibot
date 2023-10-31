import type {
  ObjectSchema,
  ObjectEntries,
  TupleSchema,
  ObjectSchemaAsync,
  ObjectEntriesAsync,
  TupleSchemaAsync,
  TupleItems,
  TupleItemsAsync,
} from '../../schemas/index.ts';
import type { BaseSchema, BaseSchemaAsync } from '../../types.ts';
import type {
  SchemaWithFallback,
  SchemaWithFallbackAsync,
} from '../fallback/index.ts';
import type {
  SchemaWithMaybeFallback,
  SchemaWithMaybeFallbackAsync,
} from '../getFallback/index.ts';

/**
 * Fallback values type.
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
> = TSchema extends
  | SchemaWithFallback<BaseSchema, infer TFallback>
  | SchemaWithFallbackAsync<BaseSchemaAsync, infer TFallback>
  ? TFallback
  : TSchema extends ObjectSchema<infer TEntries extends ObjectEntries>
  ? { [TKey in keyof TEntries]: FallbackValues<TEntries[TKey]> }
  : TSchema extends ObjectSchemaAsync<infer TEntries extends ObjectEntriesAsync>
  ? { [TKey in keyof TEntries]: FallbackValues<TEntries[TKey]> }
  : TSchema extends TupleSchema<infer TItems>
  ? { [TKey in keyof TItems]: FallbackValues<TItems[TKey]> }
  : TSchema extends TupleSchemaAsync<infer TItems>
  ? { [TKey in keyof TItems]: FallbackValues<TItems[TKey]> }
  : undefined;
