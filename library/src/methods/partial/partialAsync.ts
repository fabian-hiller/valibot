import {
  type LooseObjectIssue,
  type LooseObjectSchemaAsync,
  type ObjectIssue,
  type ObjectSchemaAsync,
  type ObjectWithRestIssue,
  type ObjectWithRestSchemaAsync,
  optionalAsync,
  type OptionalSchemaAsync,
  type StrictObjectIssue,
  type StrictObjectSchemaAsync,
} from '../../schemas/index.ts';
import type {
  BaseIssue,
  BaseSchema,
  BaseSchemaAsync,
  Config,
  Dataset,
  ErrorMessage,
  InferInput,
  InferIssue,
  InferObjectInput,
  InferObjectOutput,
  InferOutput,
  NoPipe,
  ObjectEntriesAsync,
  ObjectKeys,
} from '../../types/index.ts';

/**
 * Schema type.
 */
type Schema = NoPipe<
  | LooseObjectSchemaAsync<
      ObjectEntriesAsync,
      ErrorMessage<LooseObjectIssue> | undefined
    >
  | ObjectSchemaAsync<ObjectEntriesAsync, ErrorMessage<ObjectIssue> | undefined>
  | ObjectWithRestSchemaAsync<
      ObjectEntriesAsync,
      | BaseSchema<unknown, unknown, BaseIssue<unknown>>
      | BaseSchemaAsync<unknown, unknown, BaseIssue<unknown>>,
      ErrorMessage<ObjectWithRestIssue> | undefined
    >
  | StrictObjectSchemaAsync<
      ObjectEntriesAsync,
      ErrorMessage<StrictObjectIssue> | undefined
    >
>;

/**
 * Partial entries type.
 */
type PartialEntries<
  TEntries extends ObjectEntriesAsync,
  TKeys extends readonly (keyof TEntries)[] | undefined,
> = {
  [TKey in keyof TEntries]: TKeys extends readonly (keyof TEntries)[]
    ? TKey extends TKeys[number]
      ? OptionalSchemaAsync<TEntries[TKey], never>
      : TEntries[TKey]
    : OptionalSchemaAsync<TEntries[TKey], never>;
};

/**
 * Schema with partial type.
 */
export type SchemaWithPartialAsync<
  TSchema extends Schema,
  TKeys extends ObjectKeys<TSchema> | undefined,
> = TSchema extends
  | ObjectSchemaAsync<infer TEntries, ErrorMessage<ObjectIssue> | undefined>
  | StrictObjectSchemaAsync<
      infer TEntries,
      ErrorMessage<StrictObjectIssue> | undefined
    >
  ? Omit<TSchema, 'entries' | '_run' | '_types'> & {
      /**
       * The object entries.
       */
      readonly entries: PartialEntries<TEntries, TKeys>;
      /**
       * Parses unknown input.
       *
       * @param dataset The input dataset.
       * @param config The configuration.
       *
       * @returns The output dataset.
       *
       * @internal
       */
      _run(
        dataset: Dataset<unknown, never>,
        config: Config<InferIssue<TSchema>>
      ): Promise<
        Dataset<
          InferObjectOutput<PartialEntries<TEntries, TKeys>>,
          InferIssue<TSchema>
        >
      >;
      /**
       * Input, output and issue type.
       *
       * @internal
       */
      readonly _types?: {
        readonly input: InferObjectInput<PartialEntries<TEntries, TKeys>>;
        readonly output: InferObjectOutput<PartialEntries<TEntries, TKeys>>;
        readonly issue: InferIssue<TSchema>;
      };
    }
  : TSchema extends LooseObjectSchemaAsync<
        infer TEntries,
        ErrorMessage<LooseObjectIssue> | undefined
      >
    ? Omit<TSchema, 'entries' | '_run' | '_types'> & {
        /**
         * The object entries.
         */
        readonly entries: PartialEntries<TEntries, TKeys>;
        /**
         * Parses unknown input.
         *
         * @param dataset The input dataset.
         * @param config The configuration.
         *
         * @returns The output dataset.
         *
         * @internal
         */
        _run(
          dataset: Dataset<unknown, never>,
          config: Config<InferIssue<TSchema>>
        ): Promise<
          Dataset<
            InferObjectOutput<PartialEntries<TEntries, TKeys>> & {
              [key: string]: unknown;
            },
            InferIssue<TSchema>
          >
        >;
        /**
         * Input, output and issue type.
         *
         * @internal
         */
        readonly _types?: {
          readonly input: InferObjectInput<PartialEntries<TEntries, TKeys>> & {
            [key: string]: unknown;
          };
          readonly output: InferObjectOutput<
            PartialEntries<TEntries, TKeys>
          > & {
            [key: string]: unknown;
          };
          readonly issue: InferIssue<TSchema>;
        };
      }
    : TSchema extends ObjectWithRestSchemaAsync<
          infer TEntries,
          infer TRest,
          ErrorMessage<ObjectWithRestIssue> | undefined
        >
      ? Omit<TSchema, 'entries' | '_run' | '_types'> & {
          /**
           * The object entries.
           */
          readonly entries: PartialEntries<TEntries, TKeys>;
          /**
           * Parses unknown input.
           *
           * @param dataset The input dataset.
           * @param config The configuration.
           *
           * @returns The output dataset.
           *
           * @internal
           */
          _run(
            dataset: Dataset<unknown, never>,
            config: Config<InferIssue<TSchema>>
          ): Promise<
            Dataset<
              InferObjectOutput<PartialEntries<TEntries, TKeys>> & {
                [key: string]: InferOutput<TRest>;
              },
              InferIssue<TSchema>
            >
          >;
          /**
           * Input, output and issue type.
           *
           * @internal
           */
          readonly _types?: {
            readonly input: InferObjectInput<
              PartialEntries<TEntries, TKeys>
            > & {
              [key: string]: InferInput<TRest>;
            };
            readonly output: InferObjectOutput<
              PartialEntries<TEntries, TKeys>
            > & { [key: string]: InferOutput<TRest> };
            readonly issue: InferIssue<TSchema>;
          };
        }
      : never;

/**
 * Creates a modified copy of an object schema that marks all entries as optional.
 *
 * @param schema The schema to modify.
 *
 * @returns An object schema.
 */
export function partialAsync<const TSchema extends Schema>(
  schema: TSchema
): SchemaWithPartialAsync<TSchema, undefined>;

/**
 * Creates a modified copy of an object schema that marks the selected entries
 * as optional.
 *
 * @param schema The schema to modify.
 * @param keys The selected entries.
 *
 * @returns An object schema.
 */
export function partialAsync<
  const TSchema extends Schema,
  const TKeys extends ObjectKeys<TSchema>,
>(schema: TSchema, keys: TKeys): SchemaWithPartialAsync<TSchema, TKeys>;

export function partialAsync(
  schema: Schema,
  keys?: ObjectKeys<Schema>
): SchemaWithPartialAsync<Schema, ObjectKeys<Schema> | undefined> {
  // Create modified object entries
  const entries: PartialEntries<ObjectEntriesAsync, ObjectKeys<Schema>> = {};
  for (const key in schema.entries) {
    // @ts-expect-error
    entries[key] =
      !keys || keys.includes(key)
        ? optionalAsync(schema.entries[key])
        : schema.entries[key];
  }

  // Return modified copy of schema
  return { ...schema, entries };
}
