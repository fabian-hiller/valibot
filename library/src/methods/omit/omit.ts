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
  Config,
  Dataset,
  ErrorMessage,
  InferInput,
  InferIssue,
  InferObjectInput,
  InferObjectIssue,
  InferObjectOutput,
  InferOutput,
  NoPipe,
  ObjectEntries,
  ObjectEntriesAsync,
  ObjectKeys,
} from '../../types/index.ts';

/**
 * Schema type.
 */
type Schema = NoPipe<
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
      BaseSchema<unknown, unknown, BaseIssue<unknown>>,
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
>;

/**
 * Schema with omit type.
 */
export type SchemaWithOmit<
  TSchema extends Schema,
  TKeys extends ObjectKeys<TSchema>,
> = TSchema extends
  | ObjectSchema<infer TEntries, ErrorMessage<ObjectIssue> | undefined>
  | ObjectSchemaAsync<infer TEntries, ErrorMessage<ObjectIssue> | undefined>
  | StrictObjectSchema<
      infer TEntries,
      ErrorMessage<StrictObjectIssue> | undefined
    >
  | StrictObjectSchemaAsync<
      infer TEntries,
      ErrorMessage<StrictObjectIssue> | undefined
    >
  ? Omit<TSchema, 'entries' | '_run' | '_types'> & {
      /**
       * The object entries.
       */
      readonly entries: Omit<TEntries, TKeys[number]>;
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
        config: Config<
          | Extract<InferIssue<TSchema>, { type: TSchema['type'] }>
          | InferObjectIssue<Omit<TEntries, TKeys[number]>>
        >
      ): Dataset<
        InferObjectOutput<Omit<TEntries, TKeys[number]>>,
        | Extract<InferIssue<TSchema>, { type: TSchema['type'] }>
        | InferObjectIssue<Omit<TEntries, TKeys[number]>>
      >;
      /**
       * Input, output and issue type.
       *
       * @internal
       */
      readonly _types?: {
        readonly input: InferObjectInput<Omit<TEntries, TKeys[number]>>;
        readonly output: InferObjectOutput<Omit<TEntries, TKeys[number]>>;
        readonly issue:
          | Extract<InferIssue<TSchema>, { type: TSchema['type'] }>
          | InferObjectIssue<Omit<TEntries, TKeys[number]>>;
      };
    }
  : TSchema extends
        | LooseObjectSchema<
            infer TEntries,
            ErrorMessage<LooseObjectIssue> | undefined
          >
        | LooseObjectSchemaAsync<
            infer TEntries,
            ErrorMessage<LooseObjectIssue> | undefined
          >
    ? Omit<TSchema, 'entries' | '_run' | '_types'> & {
        /**
         * The object entries.
         */
        readonly entries: Omit<TEntries, TKeys[number]>;
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
          config: Config<
            | Extract<InferIssue<TSchema>, { type: TSchema['type'] }>
            | InferObjectIssue<Omit<TEntries, TKeys[number]>>
          >
        ): Dataset<
          InferObjectOutput<Omit<TEntries, TKeys[number]>> & {
            [key: string]: unknown;
          },
          | Extract<InferIssue<TSchema>, { type: TSchema['type'] }>
          | InferObjectIssue<Omit<TEntries, TKeys[number]>>
        >;
        /**
         * Input, output and issue type.
         *
         * @internal
         */
        readonly _types?: {
          readonly input: InferObjectInput<Omit<TEntries, TKeys[number]>> & {
            [key: string]: unknown;
          };
          readonly output: InferObjectOutput<Omit<TEntries, TKeys[number]>> & {
            [key: string]: unknown;
          };
          readonly issue:
            | Extract<InferIssue<TSchema>, { type: TSchema['type'] }>
            | InferObjectIssue<Omit<TEntries, TKeys[number]>>;
        };
      }
    : TSchema extends
          | ObjectWithRestSchema<
              infer TEntries,
              BaseSchema<unknown, unknown, BaseIssue<unknown>>,
              ErrorMessage<ObjectWithRestIssue> | undefined
            >
          | ObjectWithRestSchemaAsync<
              infer TEntries,
              BaseSchema<unknown, unknown, BaseIssue<unknown>>,
              ErrorMessage<ObjectWithRestIssue> | undefined
            >
      ? Omit<TSchema, 'entries' | '_run' | '_types'> & {
          /**
           * The object entries.
           */
          readonly entries: Omit<TEntries, TKeys[number]>;
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
            config: Config<
              | Extract<InferIssue<TSchema>, { type: TSchema['type'] }>
              | InferObjectIssue<Omit<TEntries, TKeys[number]>>
              | InferIssue<TSchema['rest']>
            >
          ): Dataset<
            InferObjectOutput<Omit<TEntries, TKeys[number]>> & {
              [key: string]: InferOutput<TSchema['rest']>;
            },
            | Extract<InferIssue<TSchema>, { type: TSchema['type'] }>
            | InferObjectIssue<Omit<TEntries, TKeys[number]>>
            | InferIssue<TSchema['rest']>
          >;
          /**
           * Input, output and issue type.
           *
           * @internal
           */
          readonly _types?: {
            readonly input: InferObjectInput<Omit<TEntries, TKeys[number]>> & {
              [key: string]: InferInput<TSchema['rest']>;
            };
            readonly output: InferObjectOutput<
              Omit<TEntries, TKeys[number]>
            > & { [key: string]: InferOutput<TSchema['rest']> };
            readonly issue:
              | Extract<InferIssue<TSchema>, { type: TSchema['type'] }>
              | InferObjectIssue<Omit<TEntries, TKeys[number]>>
              | InferIssue<TSchema['rest']>;
          };
        }
      : never;

/**
 * Creates a modified copy that contains not the selected entries.
 *
 * @param schema The schema to omit from.
 * @param keys The selected entries.
 *
 * @returns An object schema.
 */
export function omit<
  const TSchema extends Schema,
  const TKeys extends ObjectKeys<TSchema>,
>(schema: TSchema, keys: TKeys): SchemaWithOmit<TSchema, TKeys> {
  // Create modified object entries
  // @ts-expect-error
  const entries: Omit<TSchema['entries'], TKeys[number]> = {
    ...schema.entries,
  };
  for (const key of keys) {
    // @ts-expect-error
    delete entries[key];
  }

  // Rerturn modified copy of schema
  // @ts-expect-error
  return { ...schema, entries };
}
