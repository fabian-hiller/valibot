import type {
  LooseObjectIssue,
  LooseObjectSchema,
  LooseObjectSchemaAsync,
  ObjectIssue,
  ObjectSchema,
  ObjectSchemaAsync,
  ObjectWithRestIssue,
  ObjectWithRestSchema,
  ObjectWithRestSchemaAsync,
  StrictObjectIssue,
  StrictObjectSchema,
  StrictObjectSchemaAsync,
} from '../../schemas/index.ts';
import type {
  BaseIssue,
  BaseSchema,
  BaseSchemaAsync,
  ErrorMessage,
  ObjectEntries,
  ObjectEntriesAsync,
} from '../../types/index.ts';

/**
 * Schema type.
 */
type Schema =
  | LooseObjectSchema<ObjectEntries, ErrorMessage<LooseObjectIssue> | undefined>
  | LooseObjectSchemaAsync<
      ObjectEntriesAsync,
      ErrorMessage<LooseObjectIssue> | undefined
    >
  | ObjectSchema<ObjectEntries, ErrorMessage<ObjectIssue> | undefined>
  | ObjectSchemaAsync<ObjectEntriesAsync, ErrorMessage<ObjectIssue> | undefined>
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
    >;

// Type Utils
type MergeObject<A extends object, B extends object> = Omit<A, keyof B> & B;

/* eslint-disable @typescript-eslint/no-empty-object-type */
type _MergedEntries<TSchemas extends Schema[]> = TSchemas extends [
  infer TFirstSchema,
  ...infer TRestSchemas,
]
  ? TFirstSchema extends Schema
    ? TRestSchemas extends Schema[]
      ? MergeObject<TFirstSchema['entries'], _MergedEntries<TRestSchemas>>
      : TFirstSchema['entries']
    : {}
  : {};
/* eslint-enable @typescript-eslint/no-empty-object-type */

type Flatten<T> = { [K in keyof T]: T[K] } & {};
type MergedEntries<TSchemas extends Schema[]> = Flatten<
  _MergedEntries<TSchemas>
>;

/**
 * Creates a new object entries definition from existing object schemas.
 *
 * @param schema The first schema to extract the entries from.
 * @param schemas The rest schemas to merge the entries from.
 *
 * @returns The object entries from the schemas.
 */
// @__NO_SIDE_EFFECTS__
export function entriesFromObjects<
  const TSchema extends Schema,
  const TSchemas extends Schema[],
>(
  schema: TSchema,
  ...schemas: TSchemas
): MergedEntries<[TSchema, ...TSchemas]> {
  const entries = {} as MergedEntries<[TSchema, ...TSchemas]>;
  Object.assign(entries, schema.entries);
  for (const schema of schemas) {
    Object.assign(entries, schema.entries);
  }
  return entries;
}
