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
 * Schema with pick type.
 */
export type SchemaWithPick<
  TSchema extends NoPipe<
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
    | LooseObjectSchema<
        ObjectEntries,
        ErrorMessage<LooseObjectIssue> | undefined
      >
    | LooseObjectSchemaAsync<
        ObjectEntriesAsync,
        ErrorMessage<LooseObjectIssue> | undefined
      >
  >,
  TKeys extends ObjectKeys<TSchema>,
> = TSchema extends
  | ObjectSchema<ObjectEntries, ErrorMessage<ObjectIssue> | undefined>
  | ObjectSchemaAsync<ObjectEntriesAsync, ErrorMessage<ObjectIssue> | undefined>
  | StrictObjectSchema<
      ObjectEntries,
      ErrorMessage<StrictObjectIssue> | undefined
    >
  | StrictObjectSchemaAsync<
      ObjectEntriesAsync,
      ErrorMessage<StrictObjectIssue> | undefined
    >
  ? Omit<TSchema, 'entries' | '_run' | '_types'> & {
      /**
       * The object entries.
       */
      readonly entries: Pick<TSchema['entries'], TKeys[number]>;
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
          | InferObjectIssue<Pick<TSchema['entries'], TKeys[number]>>
        >
      ): Dataset<
        InferObjectOutput<Pick<TSchema['entries'], TKeys[number]>>,
        | Extract<InferIssue<TSchema>, { type: TSchema['type'] }>
        | InferObjectIssue<Pick<TSchema['entries'], TKeys[number]>>
      >;
      /**
       * Input, output and issue type.
       *
       * @internal
       */
      readonly _types?: {
        readonly input: InferObjectInput<
          Pick<TSchema['entries'], TKeys[number]>
        >;
        readonly output: InferObjectOutput<
          Pick<TSchema['entries'], TKeys[number]>
        >;
        readonly issue:
          | Extract<InferIssue<TSchema>, { type: TSchema['type'] }>
          | InferObjectIssue<Pick<TSchema['entries'], TKeys[number]>>;
      };
    }
  : TSchema extends
        | LooseObjectSchema<
            ObjectEntries,
            ErrorMessage<LooseObjectIssue> | undefined
          >
        | LooseObjectSchemaAsync<
            ObjectEntriesAsync,
            ErrorMessage<LooseObjectIssue> | undefined
          >
    ? Omit<TSchema, 'entries' | '_run' | '_types'> & {
        /**
         * The object entries.
         */
        readonly entries: Pick<TSchema['entries'], TKeys[number]>;
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
            | InferObjectIssue<Pick<TSchema['entries'], TKeys[number]>>
          >
        ): Dataset<
          InferObjectOutput<Pick<TSchema['entries'], TKeys[number]>> & {
            [key: string]: unknown;
          },
          | Extract<InferIssue<TSchema>, { type: TSchema['type'] }>
          | InferObjectIssue<Pick<TSchema['entries'], TKeys[number]>>
        >;
        /**
         * Input, output and issue type.
         *
         * @internal
         */
        readonly _types?: {
          readonly input: InferObjectInput<
            Pick<TSchema['entries'], TKeys[number]>
          > & { [key: string]: unknown };
          readonly output: InferObjectOutput<
            Pick<TSchema['entries'], TKeys[number]>
          > & { [key: string]: unknown };
          readonly issue:
            | Extract<InferIssue<TSchema>, { type: TSchema['type'] }>
            | InferObjectIssue<Pick<TSchema['entries'], TKeys[number]>>;
        };
      }
    : TSchema extends
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
      ? Omit<TSchema, 'entries' | '_run' | '_types'> & {
          /**
           * The object entries.
           */
          readonly entries: Pick<TSchema['entries'], TKeys[number]>;
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
              | InferObjectIssue<Pick<TSchema['entries'], TKeys[number]>>
              | InferIssue<TSchema['rest']>
            >
          ): Dataset<
            InferObjectOutput<Pick<TSchema['entries'], TKeys[number]>> & {
              [key: string]: InferOutput<TSchema['rest']>;
            },
            | Extract<InferIssue<TSchema>, { type: TSchema['type'] }>
            | InferObjectIssue<Pick<TSchema['entries'], TKeys[number]>>
            | InferIssue<TSchema['rest']>
          >;
          /**
           * Input, output and issue type.
           *
           * @internal
           */
          readonly _types?: {
            readonly input: InferObjectInput<
              Pick<TSchema['entries'], TKeys[number]>
            > & { [key: string]: InferInput<TSchema['rest']> };
            readonly output: InferObjectOutput<
              Pick<TSchema['entries'], TKeys[number]>
            > & { [key: string]: InferOutput<TSchema['rest']> };
            readonly issue:
              | Extract<InferIssue<TSchema>, { type: TSchema['type'] }>
              | InferObjectIssue<Pick<TSchema['entries'], TKeys[number]>>
              | InferIssue<TSchema['rest']>;
          };
        }
      : never;

/**
 * Creates a modified copy that contains only the selected entries.
 *
 * @param schema The schema to pick from.
 * @param keys The selected entries.
 *
 * @returns An object schema.
 */
export function pick<
  TSchema extends NoPipe<
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
    | LooseObjectSchema<
        ObjectEntries,
        ErrorMessage<LooseObjectIssue> | undefined
      >
    | LooseObjectSchemaAsync<
        ObjectEntriesAsync,
        ErrorMessage<LooseObjectIssue> | undefined
      >
  >,
  TKeys extends ObjectKeys<TSchema>,
>(schema: TSchema, keys: TKeys): SchemaWithPick<TSchema, TKeys> {
  // @ts-expect-error
  const entries: Pick<TSchema['entries'], TKeys[number]> = {};
  for (const key of keys) {
    // @ts-expect-error
    entries[key] = schema.entries[key];
  }
  // @ts-expect-error
  return { ...schema, entries };
}
