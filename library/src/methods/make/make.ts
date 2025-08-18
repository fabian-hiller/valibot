import type {
  LooseObjectIssue,
  LooseObjectSchema,
  ObjectIssue,
  ObjectSchema,
  ObjectWithRestIssue,
  ObjectWithRestSchema,
  StrictObjectIssue,
  StrictObjectSchema,
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
  IfMaybeUndefined,
  InferHKT,
  InferInput,
  InferIssue,
  InferObjectInput,
  InferObjectOutput,
  InferOutput,
  ObjectEntries,
  ObjectKeys,
  OutputDataset,
  PartialApplyHKT,
  Prettify,
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

export interface SchemaModifierHKT extends BaseHKT<'schemaModifier'> {
  argConstraint: [
    wrapped: BaseSchema<unknown, unknown, BaseIssue<unknown>>,
    ...args: unknown[],
  ];

  extraArgs: unknown[];

  wrapped: this['args'][0];

  result: BaseSchema<unknown, unknown, BaseIssue<unknown>>;
}

type InferExtraArgs<
  TModifier extends SchemaModifierHKT,
  TSchema extends BaseSchema<unknown, unknown, BaseIssue<unknown>> = BaseSchema<
    0,
    0,
    BaseIssue<0>
  >,
> = PartialApplyHKT<
  TModifier,
  [TSchema, ...args: TModifier['extraArgs']]
>['extraArgs'];

export type MakeExtraArgs<
  THKT extends SchemaModifierHKT,
  TExtraArgs extends unknown[],
  TEntries extends ObjectEntries,
> = {
  [I in keyof TExtraArgs]: IfMaybeUndefined<
    // if the argument is optional, make each key optional
    TExtraArgs[I],
    {
      [K in keyof TEntries]?: InferExtraArgs<THKT, TEntries[K]>[Extract<
        I,
        keyof InferExtraArgs<THKT, TEntries[K]>
      >];
    },
    {
      [K in keyof TEntries]: InferExtraArgs<THKT, TEntries[K]>[Extract<
        I,
        keyof InferExtraArgs<THKT, TEntries[K]>
      >];
    }
  >;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ExtractKeyArgs<TExtraArgs extends any[], TKey extends PropertyKey> = {
  [I in keyof TExtraArgs]: TExtraArgs[I] extends Record<TKey, infer T>
    ? T
    : undefined;
};

export type ModifiedEntries<
  TEntries extends ObjectEntries,
  TModifier extends BaseHKTable<SchemaModifierHKT>,
  TKeys extends readonly (keyof TEntries)[] | undefined,
  TExtraArgs extends unknown[],
> = Prettify<{
  [TKey in keyof TEntries]: TKeys extends readonly (keyof TEntries)[]
    ? TKey extends TKeys[number]
      ? ApplyHKT<
          TModifier,
          [
            TEntries[TKey],
            ...Extract<ExtractKeyArgs<TExtraArgs, TKey>, unknown[]>,
          ],
          'schemaModifier'
        >
      : TEntries[TKey]
    : ApplyHKT<
        TModifier,
        [
          TEntries[TKey],
          ...Extract<ExtractKeyArgs<TExtraArgs, TKey>, unknown[]>,
        ],
        'schemaModifier'
      >;
}>;

/**
 * Modified schema
 */
export type ModifiedSchema<
  TSchema extends Schema,
  TModifier extends BaseHKTable<SchemaModifierHKT>,
  TKeys extends ObjectKeys<TSchema> | undefined,
  TExtraArgs extends MakeExtraArgs<
    InferHKT<TModifier>,
    InferExtraArgs<InferHKT<TModifier>>,
    TSchema['entries']
  >,
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
      readonly entries: ModifiedEntries<TEntries, TModifier, TKeys, TExtraArgs>;
      /**
       * The Standard Schema properties.
       *
       * @internal
       */
      readonly '~standard': StandardProps<
        InferObjectInput<
          ModifiedEntries<TEntries, TModifier, TKeys, TExtraArgs>
        >,
        InferObjectOutput<
          ModifiedEntries<TEntries, TModifier, TKeys, TExtraArgs>
        >
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
        InferObjectOutput<
          ModifiedEntries<TEntries, TModifier, TKeys, TExtraArgs>
        >,
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
              ModifiedEntries<TEntries, TModifier, TKeys, TExtraArgs>
            >;
            readonly output: InferObjectOutput<
              ModifiedEntries<TEntries, TModifier, TKeys, TExtraArgs>
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
        readonly entries: ModifiedEntries<
          TEntries,
          TModifier,
          TKeys,
          TExtraArgs
        >;
        /**
         * The Standard Schema properties.
         *
         * @internal
         */
        readonly '~standard': StandardProps<
          InferObjectInput<
            ModifiedEntries<TEntries, TModifier, TKeys, TExtraArgs>
          > & {
            [key: string]: unknown;
          },
          InferObjectOutput<
            ModifiedEntries<TEntries, TModifier, TKeys, TExtraArgs>
          > & {
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
          InferObjectOutput<
            ModifiedEntries<TEntries, TModifier, TKeys, TExtraArgs>
          > & {
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
                ModifiedEntries<TEntries, TModifier, TKeys, TExtraArgs>
              > & {
                [key: string]: unknown;
              };
              readonly output: InferObjectOutput<
                ModifiedEntries<TEntries, TModifier, TKeys, TExtraArgs>
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
          readonly entries: ModifiedEntries<
            TEntries,
            TModifier,
            TKeys,
            TExtraArgs
          >;
          /**
           * The Standard Schema properties.
           *
           * @internal
           */
          readonly '~standard': StandardProps<
            InferObjectInput<
              ModifiedEntries<TEntries, TModifier, TKeys, TExtraArgs>
            > & {
              [key: string]: InferInput<TRest>;
            },
            InferObjectOutput<
              ModifiedEntries<TEntries, TModifier, TKeys, TExtraArgs>
            > & {
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
            InferObjectOutput<
              ModifiedEntries<TEntries, TModifier, TKeys, TExtraArgs>
            > & {
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
                  ModifiedEntries<TEntries, TModifier, TKeys, TExtraArgs>
                > & {
                  [key: string]: InferInput<TRest>;
                };
                readonly output: InferObjectOutput<
                  ModifiedEntries<TEntries, TModifier, TKeys, TExtraArgs>
                > & { [key: string]: InferOutput<TRest> };
                readonly issue: InferIssue<TSchema>;
              }
            | undefined;
        }
      : never;

/**
 * Create a modified copy of an object schema that applies a modifier to the selected entries.
 *
 * @param schema The schema to modify
 * @param modifier The modifier to apply, e.g. `optional` or `nonOptional`
 * @param keys The selected entries
 * @param extraArgs Extra configuration for the modifier, per key
 *
 * @returns An object schema
 */
export function make<
  TSchema extends Schema,
  TModifier extends BaseHKTable<SchemaModifierHKT>,
  TKeys extends ObjectKeys<TSchema>,
  TExtraArgs extends MakeExtraArgs<
    InferHKT<TModifier>,
    InferExtraArgs<InferHKT<TModifier>>,
    Pick<TSchema['entries'], TKeys[number]>
  >,
>(
  schema: TSchema,
  modifier: HKTImplementation<TModifier>,
  keys: TKeys,
  ...extraArgs: TExtraArgs
): ModifiedSchema<TSchema, TModifier, TKeys, TExtraArgs>;

/**
 * Create a modified copy of an object schema that applies a modifier to all entries.
 *
 * @param schema The schema to modify
 * @param modifier The modifier to apply, e.g. `optional` or `nonOptional`
 * @param extraArgs Extra configuration for the modifier, per key
 *
 * @returns An object schema
 */
export function make<
  TSchema extends Schema,
  TModifier extends BaseHKTable<SchemaModifierHKT>,
  TExtraArgs extends MakeExtraArgs<
    InferHKT<TModifier>,
    InferExtraArgs<InferHKT<TModifier>>,
    TSchema['entries']
  >,
>(
  schema: TSchema,
  modifier: HKTImplementation<TModifier>,
  ...extraArgs: TExtraArgs
): ModifiedSchema<TSchema, TModifier, undefined, TExtraArgs>;

// @__NO_SIDE_EFFECTS_
export function make(
  schema: Schema,
  modifier: HKTImplementation<BaseHKTable<SchemaModifierHKT>>,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ...args: any[]
): Schema {
  const keys = Array.isArray(args[0]) ? args.shift() : undefined;

  // Create modified object entries
  const entries: Record<
    string,
    BaseSchema<unknown, unknown, BaseIssue<unknown>>
  > = {};
  for (const key in schema.entries) {
    entries[key] =
      !keys || keys.includes(key)
        ? modifier(schema.entries[key], ...args.map((arg) => arg?.[key]))
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
