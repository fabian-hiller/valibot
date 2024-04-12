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
 * Schema with omit type.
 */
export type SchemaWithOmit<
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
  readonly entries: Omit<TSchema['entries'], TKeys[number]>;
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
          Omit<TSchema['entries'], TKeys[number]>,
          InferObjectRest<TSchema>
        >
    >
  ): Dataset<
    InferObjectOutput<
      Omit<TSchema['entries'], TKeys[number]>,
      InferObjectRest<TSchema>
    >,
    | Extract<InferIssue<TSchema>, { type: TSchema['type'] }>
    | InferObjectIssue<
        Omit<TSchema['entries'], TKeys[number]>,
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
      Omit<TSchema['entries'], TKeys[number]>,
      InferObjectRest<TSchema>
    >;
    readonly output: InferObjectOutput<
      Omit<TSchema['entries'], TKeys[number]>,
      InferObjectRest<TSchema>
    >;
    readonly issue:
      | Extract<InferIssue<TSchema>, { type: TSchema['type'] }>
      | InferObjectIssue<
          Omit<TSchema['entries'], TKeys[number]>,
          InferObjectRest<TSchema>
        >;
  };
};

/**
 * Creates a modified copy that contains not the selected entries.
 *
 * @param schema The schema to omit from.
 * @param keys The selected entries.
 *
 * @returns An object schema.
 */
export function omit<
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
>(schema: TSchema, keys: TKeys): SchemaWithOmit<TSchema, TKeys> {
  // @ts-expect-error
  const entries: Omit<TSchema['entries'], TKeys[number]> = {
    ...schema.entries,
  };
  // @ts-expect-error
  for (const key of keys) delete entries[key];
  // @ts-expect-error
  return { ...schema, entries };
}
