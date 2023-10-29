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
    : TSchema extends ObjectSchema<infer TObjectEntries extends ObjectEntries>
    ? { [TKey in keyof TObjectEntries]: DefaultValues<TObjectEntries[TKey]> }
    : TSchema extends ObjectSchemaAsync<
        infer TObjectEntries extends ObjectEntriesAsync
      >
    ? { [TKey in keyof TObjectEntries]: DefaultValues<TObjectEntries[TKey]> }
    : TSchema extends TupleSchema<infer TTupleItems>
    ? { [TKey in keyof TTupleItems]: DefaultValues<TTupleItems[TKey]> }
    : TSchema extends TupleSchemaAsync<infer TTupleItems>
    ? { [TKey in keyof TTupleItems]: DefaultValues<TTupleItems[TKey]> }
    : undefined;
