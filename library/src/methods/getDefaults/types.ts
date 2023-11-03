import type {
  OptionalSchema,
  NullableSchema,
  NullishSchema,
  ObjectSchema,
  ObjectEntries,
  TupleSchema,
  OptionalSchemaAsync,
  NullableSchemaAsync,
  ObjectSchemaAsync,
  ObjectEntriesAsync,
  TupleSchemaAsync,
  NullishSchemaAsync,
} from '../../schemas/index.ts';
import type { BaseSchema, BaseSchemaAsync } from '../../types.ts';

/**
 * Default values type.
 */
export type DefaultValues<TSchema extends BaseSchema | BaseSchemaAsync> =
  TSchema extends
    | OptionalSchema<any, infer TDefault>
    | OptionalSchemaAsync<any, infer TDefault>
    | NullableSchema<any, infer TDefault>
    | NullableSchemaAsync<any, infer TDefault>
    | NullishSchema<any, infer TDefault>
    | NullishSchemaAsync<any, infer TDefault>
    ? TDefault
    : TSchema extends ObjectSchema<infer TEntries extends ObjectEntries>
    ? { [TKey in keyof TEntries]: DefaultValues<TEntries[TKey]> }
    : TSchema extends ObjectSchemaAsync<
        infer TEntries extends ObjectEntriesAsync
      >
    ? { [TKey in keyof TEntries]: DefaultValues<TEntries[TKey]> }
    : TSchema extends TupleSchema<infer TItems>
    ? { [TKey in keyof TItems]: DefaultValues<TItems[TKey]> }
    : TSchema extends TupleSchemaAsync<infer TItems>
    ? { [TKey in keyof TItems]: DefaultValues<TItems[TKey]> }
    : undefined;
