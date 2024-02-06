import type {
  ObjectEntries,
  ObjectEntriesAsync,
  ObjectSchema,
  ObjectSchemaAsync,
  TupleSchema,
  TupleSchemaAsync,
} from '../../schemas/index.ts';
import type { BaseSchema, BaseSchemaAsync } from '../../types/index.ts';
import type { DefaultValue } from '../getDefault/index.ts';

/**
 * Default values type.
 */
export type DefaultValues<TSchema extends BaseSchema | BaseSchemaAsync> =
  TSchema extends ObjectSchema<infer TEntries extends ObjectEntries>
    ? { [TKey in keyof TEntries]: DefaultValues<TEntries[TKey]> }
    : TSchema extends ObjectSchemaAsync<
        infer TEntries extends ObjectEntriesAsync
      >
    ? { [TKey in keyof TEntries]: DefaultValues<TEntries[TKey]> }
    : TSchema extends TupleSchema<infer TItems>
    ? { [TKey in keyof TItems]: DefaultValues<TItems[TKey]> }
    : TSchema extends TupleSchemaAsync<infer TItems>
    ? { [TKey in keyof TItems]: DefaultValues<TItems[TKey]> }
    : DefaultValue<TSchema>;
