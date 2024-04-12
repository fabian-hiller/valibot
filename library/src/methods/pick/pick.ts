import type {
  LooseObjectIssue,
  LooseObjectSchema,
  LooseObjectSchemaAsync,
  NeverIssue,
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
  InferIssue,
  InferObjectInput,
  InferObjectIssue,
  InferObjectOutput,
  InferObjectRest,
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
        ErrorMessage<StrictObjectIssue | NeverIssue> | undefined
      >
    | StrictObjectSchemaAsync<
        ObjectEntriesAsync,
        ErrorMessage<StrictObjectIssue | NeverIssue> | undefined
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
> = Omit<TSchema, 'entries' | '_run' | '_types'> & {
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
      | InferObjectIssue<
          Pick<TSchema['entries'], TKeys[number]>,
          InferObjectRest<TSchema>
        >
    >
  ): Dataset<
    InferObjectOutput<
      Pick<TSchema['entries'], TKeys[number]>,
      InferObjectRest<TSchema>
    >,
    | Extract<InferIssue<TSchema>, { type: TSchema['type'] }>
    | InferObjectIssue<
        Pick<TSchema['entries'], TKeys[number]>,
        InferObjectRest<TSchema>
      >
  >;
  /**
   * Input, output and issue type.
   *
   * @internal
   */
  readonly _types?: {
    readonly input: InferObjectInput<
      Pick<TSchema['entries'], TKeys[number]>,
      InferObjectRest<TSchema>
    >;
    readonly output: InferObjectOutput<
      Pick<TSchema['entries'], TKeys[number]>,
      InferObjectRest<TSchema>
    >;
    readonly issue:
      | Extract<InferIssue<TSchema>, { type: TSchema['type'] }>
      | InferObjectIssue<
          Pick<TSchema['entries'], TKeys[number]>,
          InferObjectRest<TSchema>
        >;
  };
};

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
        ErrorMessage<StrictObjectIssue | NeverIssue> | undefined
      >
    | StrictObjectSchemaAsync<
        ObjectEntriesAsync,
        ErrorMessage<StrictObjectIssue | NeverIssue> | undefined
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
  // @ts-expect-error
  for (const key of keys) entries[key] = schema.entries[key];
  // @ts-expect-error
  return { ...schema, entries };
}
