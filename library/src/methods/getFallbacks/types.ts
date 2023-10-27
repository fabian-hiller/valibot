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
  : TSchema extends ObjectSchema<infer TObjectEntries extends ObjectEntries>
  ? { [TKey in keyof TObjectEntries]: FallbackValues<TObjectEntries[TKey]> }
  : TSchema extends ObjectSchemaAsync<
      infer TObjectEntries extends ObjectEntriesAsync
    >
  ? { [TKey in keyof TObjectEntries]: FallbackValues<TObjectEntries[TKey]> }
  : TSchema extends TupleSchema<infer TTupleItems>
  ? { [TKey in keyof TTupleItems]: FallbackValues<TTupleItems[TKey]> }
  : TSchema extends TupleSchemaAsync<infer TTupleItems>
  ? { [TKey in keyof TTupleItems]: FallbackValues<TTupleItems[TKey]> }
  : undefined;
