import {
  type LooseObjectIssue,
  type LooseObjectSchema,
  type ObjectIssue,
  type ObjectSchema,
  type ObjectWithRestIssue,
  type ObjectWithRestSchema,
  type StrictObjectIssue,
  type StrictObjectSchema,
} from '../../schemas/index.ts';
import type {
  ApplyHKT,
  BaseHKT,
  BaseHKTable,
  BaseIssue,
  BaseSchema,
  Config,
  ErrorMessage,
  HKTImplementation,
  InferInput,
  InferIssue,
  InferObjectInput,
  InferObjectOutput,
  InferOutput,
  ObjectEntries,
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
  | LooseObjectSchema<ObjectEntries, ErrorMessage<LooseObjectIssue> | undefined>
  | ObjectSchema<ObjectEntries, ErrorMessage<ObjectIssue> | undefined>
  | ObjectWithRestSchema<
      ObjectEntries,
      BaseSchema<unknown, unknown, BaseIssue<unknown>>,
      ErrorMessage<ObjectWithRestIssue> | undefined
    >
  | StrictObjectSchema<
      ObjectEntries,
      ErrorMessage<StrictObjectIssue> | undefined
    >
>;

/**
 * Modifier type.
 *
 * partialBy: (schema: BaseSchema<unknown, unknown, BaseIssue<unknown>>) => BaseSchema<unknown, unknown, BaseIssue<unknown>>
 */
export interface PartialByModifierHKT extends BaseHKT<'partialBy'> {
  argConstraint: [schema: BaseSchema<unknown, unknown, BaseIssue<unknown>>];
  result: BaseSchema<unknown, unknown, BaseIssue<unknown>>;

  schema: this['args'][0];
}

/**
 * Partial entries type.
 */
type PartialByEntries<
  TEntries extends ObjectEntries,
  TModifier extends BaseHKTable<PartialByModifierHKT>,
  TKeys extends readonly (keyof TEntries)[] | undefined,
> = {
  [TKey in keyof TEntries]: TKeys extends readonly (keyof TEntries)[]
    ? TKey extends TKeys[number]
      ? ApplyHKT<TModifier, [TEntries[TKey]], 'partialBy'>
      : TEntries[TKey]
    : ApplyHKT<TModifier, [TEntries[TKey]], 'partialBy'>;
};

/**
 * Schema with partial type.
 */
export type SchemaWithPartialBy<
  TSchema extends Schema,
  TModifier extends BaseHKTable<PartialByModifierHKT>,
  TKeys extends ObjectKeys<TSchema> | undefined,
> = TSchema extends
  | ObjectSchema<infer TEntries, ErrorMessage<ObjectIssue> | undefined>
  | StrictObjectSchema<
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
      ) => OutputDataset<
        InferObjectOutput<PartialByEntries<TEntries, TModifier, TKeys>>,
        InferIssue<TSchema>
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
  : TSchema extends LooseObjectSchema<
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
        ) => OutputDataset<
          InferObjectOutput<PartialByEntries<TEntries, TModifier, TKeys>> & {
            [key: string]: unknown;
          },
          InferIssue<TSchema>
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
    : TSchema extends ObjectWithRestSchema<
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
          ) => OutputDataset<
            InferObjectOutput<PartialByEntries<TEntries, TModifier, TKeys>> & {
              [key: string]: InferOutput<TRest>;
            },
            InferIssue<TSchema>
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
 * @param modifier The modifier to apply, e.g. `optional` or `nullable`.
 *
 * @returns An object schema.
 */
export function partialBy<
  const TSchema extends Schema,
  const TModifier extends BaseHKTable<PartialByModifierHKT>,
>(
  schema: TSchema,
  modifier: HKTImplementation<TModifier>
): SchemaWithPartialBy<TSchema, TModifier, undefined>;

/**
 * Creates a modified copy of an object schema that applies a modifier to the selected entries.
 *
 * @param schema The schema to modify.
 * @param modifier The modifier to apply, e.g. `optional` or `nullable`.
 * @param keys The selected entries.
 *
 * @returns An object schema.
 */
export function partialBy<
  const TSchema extends Schema,
  const TKeys extends ObjectKeys<TSchema>,
  const TModifier extends BaseHKTable<PartialByModifierHKT>,
>(
  schema: TSchema,
  modifier: HKTImplementation<TModifier>,
  keys: TKeys
): SchemaWithPartialBy<TSchema, TModifier, TKeys>;

// @__NO_SIDE_EFFECTS__
export function partialBy(
  schema: Schema,
  modifier: HKTImplementation<BaseHKTable<PartialByModifierHKT>>,
  keys?: ObjectKeys<Schema>
): SchemaWithPartialBy<
  Schema,
  BaseHKTable<PartialByModifierHKT>,
  ObjectKeys<Schema> | undefined
> {
  // Create modified object entries
  const entries: PartialByEntries<
    ObjectEntries,
    BaseHKTable<PartialByModifierHKT>,
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
