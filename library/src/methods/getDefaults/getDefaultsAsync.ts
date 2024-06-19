import type {
  LooseObjectIssue,
  LooseObjectSchema,
  LooseObjectSchemaAsync,
  LooseTupleIssue,
  LooseTupleSchema,
  LooseTupleSchemaAsync,
  ObjectIssue,
  ObjectSchema,
  ObjectSchemaAsync,
  ObjectWithRestIssue,
  ObjectWithRestSchema,
  ObjectWithRestSchemaAsync,
  StrictObjectIssue,
  StrictObjectSchema,
  StrictObjectSchemaAsync,
  StrictTupleIssue,
  StrictTupleSchema,
  StrictTupleSchemaAsync,
  TupleIssue,
  TupleSchema,
  TupleSchemaAsync,
  TupleWithRestIssue,
  TupleWithRestSchema,
  TupleWithRestSchemaAsync,
} from '../../schemas/index.ts';
import type {
  BaseIssue,
  BaseSchema,
  BaseSchemaAsync,
  ErrorMessage,
  ObjectEntries,
  ObjectEntriesAsync,
  TupleItems,
  TupleItemsAsync,
} from '../../types/index.ts';
import { getDefault } from '../getDefault/index.ts';
import type { InferDefaults } from './types.ts';

/**
 * Returns the default values of the schema.
 *
 * Hint: The difference to `getDefault` is that for object and tuple schemas
 * this function recursively returns the default values of the subschemas
 * instead of `undefined`.
 *
 * @param schema The schema to get them from.
 *
 * @returns The default values.
 */
export async function getDefaultsAsync<
  const TSchema extends
    | BaseSchema<unknown, unknown, BaseIssue<unknown>>
    | BaseSchemaAsync<unknown, unknown, BaseIssue<unknown>>
    | LooseObjectSchema<
        ObjectEntries,
        ErrorMessage<LooseObjectIssue> | undefined
      >
    | LooseObjectSchemaAsync<
        ObjectEntriesAsync,
        ErrorMessage<LooseObjectIssue> | undefined
      >
    | LooseTupleSchema<TupleItems, ErrorMessage<LooseTupleIssue> | undefined>
    | LooseTupleSchemaAsync<
        TupleItemsAsync,
        ErrorMessage<LooseTupleIssue> | undefined
      >
    | ObjectSchema<ObjectEntries, ErrorMessage<ObjectIssue> | undefined>
    | ObjectSchemaAsync<
        ObjectEntriesAsync,
        ErrorMessage<ObjectIssue> | undefined
      >
    | ObjectWithRestSchema<
        ObjectEntries,
        BaseSchema<unknown, unknown, BaseIssue<unknown>>,
        ErrorMessage<ObjectWithRestIssue> | undefined
      >
    | ObjectWithRestSchemaAsync<
        ObjectEntriesAsync,
        | BaseSchema<unknown, unknown, BaseIssue<unknown>>
        | BaseSchemaAsync<unknown, unknown, BaseIssue<unknown>>,
        ErrorMessage<ObjectWithRestIssue> | undefined
      >
    | StrictObjectSchema<
        ObjectEntries,
        ErrorMessage<StrictObjectIssue> | undefined
      >
    | StrictObjectSchemaAsync<
        ObjectEntriesAsync,
        ErrorMessage<StrictObjectIssue> | undefined
      >
    | StrictTupleSchema<TupleItems, ErrorMessage<StrictTupleIssue> | undefined>
    | StrictTupleSchemaAsync<
        TupleItemsAsync,
        ErrorMessage<StrictTupleIssue> | undefined
      >
    | TupleSchema<TupleItems, ErrorMessage<TupleIssue> | undefined>
    | TupleSchemaAsync<TupleItemsAsync, ErrorMessage<TupleIssue> | undefined>
    | TupleWithRestSchema<
        TupleItems,
        BaseSchema<unknown, unknown, BaseIssue<unknown>>,
        ErrorMessage<TupleWithRestIssue> | undefined
      >
    | TupleWithRestSchemaAsync<
        TupleItemsAsync,
        | BaseSchema<unknown, unknown, BaseIssue<unknown>>
        | BaseSchemaAsync<unknown, unknown, BaseIssue<unknown>>,
        ErrorMessage<TupleWithRestIssue> | undefined
      >,
>(schema: TSchema): Promise<InferDefaults<TSchema>> {
  // If it is an object schema, return defaults of entries
  if ('entries' in schema) {
    return Object.fromEntries(
      await Promise.all(
        Object.entries(schema.entries).map(async ([key, value]) => [
          key,
          await getDefaultsAsync(value),
        ])
      )
    ) as InferDefaults<TSchema>;
  }

  // If it is a tuple schema, return defaults of items
  if ('items' in schema) {
    return Promise.all(schema.items.map(getDefaultsAsync)) as Promise<
      InferDefaults<TSchema>
    >;
  }

  // Otherwise, return default or `undefined`
  // @ts-expect-error
  return getDefault(schema);
}
