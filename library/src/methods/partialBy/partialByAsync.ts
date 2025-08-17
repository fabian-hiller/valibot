import {
  type LooseObjectIssue,
  type LooseObjectSchemaAsync,
  type ObjectIssue,
  type ObjectSchemaAsync,
  type ObjectWithRestIssue,
  type ObjectWithRestSchemaAsync,
  type StrictObjectIssue,
  type StrictObjectSchemaAsync,
} from '../../schemas/index.ts';
import type {
  ApplyHKT,
  BaseHKT,
  BaseHKTable,
  BaseIssue,
  BaseSchema,
  BaseSchemaAsync,
  Config,
  ErrorMessage,
  HKTImplementation,
  InferInput,
  InferIssue,
  InferObjectInput,
  InferObjectOutput,
  InferOutput,
  ObjectEntriesAsync,
  ObjectKeys,
  OutputDataset,
  SchemaWithoutPipe,
  StandardProps,
  UnknownDataset,
} from '../../types/index.ts';
import { _getStandardProps } from '../../utils/index.ts';

/**
 * Schema type.
 */
type Schema = SchemaWithoutPipe<
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
 * Modifier type.
 *
 * partialByAsync: (schema: BaseSchemaAsync<unknown, unknown, BaseIssue<unknown>> | BaseSchema<unknown, unknown, BaseIssue<unknown>>) => BaseSchemaAsync<unknown, unknown, BaseIssue<unknown>> | BaseSchema<unknown, unknown, BaseIssue<unknown>>
 */
export interface PartialByModifierAsyncHKT extends BaseHKT<'partialByAsync'> {
  argConstraint: [
    schema:
      | BaseSchemaAsync<unknown, unknown, BaseIssue<unknown>>
      | BaseSchema<unknown, unknown, BaseIssue<unknown>>,
  ];
  result:
    | BaseSchemaAsync<unknown, unknown, BaseIssue<unknown>>
    | BaseSchema<unknown, unknown, BaseIssue<unknown>>;

  schema: this['args'][0];
}

/**
 * Partial entries type.
 */
type PartialByEntries<
  TEntries extends ObjectEntriesAsync,
  TModifier extends BaseHKTable<PartialByModifierAsyncHKT>,
  TKeys extends readonly (keyof TEntries)[] | undefined,
> = {
  [TKey in keyof TEntries]: TKeys extends readonly (keyof TEntries)[]
    ? TKey extends TKeys[number]
      ? ApplyHKT<TModifier, [TEntries[TKey]], 'partialByAsync'>
      : TEntries[TKey]
    : ApplyHKT<TModifier, [TEntries[TKey]], 'partialByAsync'>;
};

/**
 * Schema with partial type.
 */
export type SchemaWithPartialByAsync<
  TSchema extends Schema,
  TModifier extends BaseHKTable<PartialByModifierAsyncHKT>,
  TKeys extends ObjectKeys<TSchema> | undefined,
> = TSchema extends
  | ObjectSchemaAsync<infer TEntries, ErrorMessage<ObjectIssue> | undefined>
  | StrictObjectSchemaAsync<
      infer TEntries,
      ErrorMessage<StrictObjectIssue> | undefined
    >
  ? Omit<TSchema, 'entries' | '~standard' | '~run' | '~types'> & {
      /**
       * The object entries.
       */
      readonly entries: PartialByEntries<TEntries, TModifier, TKeys>;
      /**
       * The Standard Schema properties.
       *
       * @internal
       */
      readonly '~standard': StandardProps<
        InferObjectInput<PartialByEntries<TEntries, TModifier, TKeys>>,
        InferObjectOutput<PartialByEntries<TEntries, TModifier, TKeys>>
      >;
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
      readonly '~run': (
        dataset: UnknownDataset,
        config: Config<BaseIssue<unknown>>
      ) => Promise<
        OutputDataset<
          InferObjectOutput<PartialByEntries<TEntries, TModifier, TKeys>>,
          InferIssue<TSchema>
        >
      >;
      /**
       * The input, output and issue type.
       *
       * @internal
       */
      readonly '~types'?:
        | {
            readonly input: InferObjectInput<
              PartialByEntries<TEntries, TModifier, TKeys>
            >;
            readonly output: InferObjectOutput<
              PartialByEntries<TEntries, TModifier, TKeys>
            >;
            readonly issue: InferIssue<TSchema>;
          }
        | undefined;
    }
  : TSchema extends LooseObjectSchemaAsync<
        infer TEntries,
        ErrorMessage<LooseObjectIssue> | undefined
      >
    ? Omit<TSchema, 'entries' | '~standard' | '~run' | '~types'> & {
        /**
         * The object entries.
         */
        readonly entries: PartialByEntries<TEntries, TModifier, TKeys>;
        /**
         * The Standard Schema properties.
         *
         * @internal
         */
        readonly '~standard': StandardProps<
          InferObjectInput<PartialByEntries<TEntries, TModifier, TKeys>> & {
            [key: string]: unknown;
          },
          InferObjectOutput<PartialByEntries<TEntries, TModifier, TKeys>> & {
            [key: string]: unknown;
          }
        >;
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
        readonly '~run': (
          dataset: UnknownDataset,
          config: Config<BaseIssue<unknown>>
        ) => Promise<
          OutputDataset<
            InferObjectOutput<PartialByEntries<TEntries, TModifier, TKeys>> & {
              [key: string]: unknown;
            },
            InferIssue<TSchema>
          >
        >;
        /**
         * The input, output and issue type.
         *
         * @internal
         */
        readonly '~types'?:
          | {
              readonly input: InferObjectInput<
                PartialByEntries<TEntries, TModifier, TKeys>
              > & {
                [key: string]: unknown;
              };
              readonly output: InferObjectOutput<
                PartialByEntries<TEntries, TModifier, TKeys>
              > & {
                [key: string]: unknown;
              };
              readonly issue: InferIssue<TSchema>;
            }
          | undefined;
      }
    : TSchema extends ObjectWithRestSchemaAsync<
          infer TEntries,
          infer TRest,
          ErrorMessage<ObjectWithRestIssue> | undefined
        >
      ? Omit<TSchema, 'entries' | '~standard' | '~run' | '~types'> & {
          /**
           * The object entries.
           */
          readonly entries: PartialByEntries<TEntries, TModifier, TKeys>;
          /**
           * The Standard Schema properties.
           *
           * @internal
           */
          readonly '~standard': StandardProps<
            InferObjectInput<PartialByEntries<TEntries, TModifier, TKeys>> & {
              [key: string]: InferInput<TRest>;
            },
            InferObjectOutput<PartialByEntries<TEntries, TModifier, TKeys>> & {
              [key: string]: InferOutput<TRest>;
            }
          >;
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
          readonly '~run': (
            dataset: UnknownDataset,
            config: Config<BaseIssue<unknown>>
          ) => Promise<
            OutputDataset<
              InferObjectOutput<
                PartialByEntries<TEntries, TModifier, TKeys>
              > & {
                [key: string]: InferOutput<TRest>;
              },
              InferIssue<TSchema>
            >
          >;
          /**
           * The input, output and issue type.
           *
           * @internal
           */
          readonly '~types'?:
            | {
                readonly input: InferObjectInput<
                  PartialByEntries<TEntries, TModifier, TKeys>
                > & {
                  [key: string]: InferInput<TRest>;
                };
                readonly output: InferObjectOutput<
                  PartialByEntries<TEntries, TModifier, TKeys>
                > & { [key: string]: InferOutput<TRest> };
                readonly issue: InferIssue<TSchema>;
              }
            | undefined;
        }
      : never;

/**
 * Creates a modified copy of an object schema that applies a modifier to all entries.
 *
 * @param schema The schema to modify.
 * @param modifier The modifier to apply, e.g. `optionalAsync` or `nullableAsync`.
 *
 * @returns An object schema.
 */
export function partialByAsync<
  const TSchema extends Schema,
  const TModifier extends BaseHKTable<PartialByModifierAsyncHKT>,
>(
  schema: TSchema,
  modifier: HKTImplementation<TModifier>
): SchemaWithPartialByAsync<TSchema, TModifier, undefined>;

/**
 * Creates a modified copy of an object schema that applies a modifier to the selected entries.
 *
 * @param schema The schema to modify.
 * @param modifier The modifier to apply, e.g. `optionalAsync` or `nullableAsync`.
 * @param keys The selected entries.
 *
 * @returns An object schema.
 */
export function partialByAsync<
  const TSchema extends Schema,
  const TKeys extends ObjectKeys<TSchema>,
  const TModifier extends BaseHKTable<PartialByModifierAsyncHKT>,
>(
  schema: TSchema,
  modifier: HKTImplementation<TModifier>,
  keys: TKeys
): SchemaWithPartialByAsync<TSchema, TModifier, TKeys>;

// @__NO_SIDE_EFFECTS__
export function partialByAsync(
  schema: Schema,
  modifier: HKTImplementation<BaseHKTable<PartialByModifierAsyncHKT>>,
  keys?: ObjectKeys<Schema>
): SchemaWithPartialByAsync<
  Schema,
  BaseHKTable<PartialByModifierAsyncHKT>,
  ObjectKeys<Schema> | undefined
> {
  // Create modified object entries
  const entries: PartialByEntries<
    ObjectEntriesAsync,
    BaseHKTable<PartialByModifierAsyncHKT>,
    ObjectKeys<Schema>
  > = {};
  for (const key in schema.entries) {
    entries[key] =
      !keys || keys.includes(key)
        ? modifier(schema.entries[key])
        : schema.entries[key];
  }

  // Return modified copy of schema
  return {
    ...schema,
    entries,
    get '~standard'() {
      return _getStandardProps(this);
    },
  };
}
