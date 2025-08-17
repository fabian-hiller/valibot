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
  BaseHKT,
  BaseHKTable,
  BaseIssue,
  BaseSchema,
  BaseSchemaAsync,
  CallHKT,
  Config,
  ErrorMessage,
  HKTImplementation,
  InferHKT,
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
 * Required by modifier HKT.
 */
export interface RequiredByModifierAsyncHKT extends BaseHKT<'requiredByAsync'> {
  argConstraint: [
    schema:
      | BaseSchemaAsync<unknown, unknown, BaseIssue<unknown>>
      | BaseSchema<unknown, unknown, BaseIssue<unknown>>,
    message: ErrorMessage<this['issue']> | undefined,
  ];
  result:
    | BaseSchemaAsync<unknown, unknown, BaseIssue<unknown>>
    | BaseSchema<unknown, unknown, BaseIssue<unknown>>;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  issue: any;

  schema: this['args'][0];
  message: this['args'][1];
}

type InferRequiredByAsyncIssue<
  TModifier extends BaseHKTable<RequiredByModifierAsyncHKT>,
> = InferHKT<TModifier>['issue'];

/**
 * Required entries type.
 */
type RequiredByEntries<
  TEntries extends ObjectEntriesAsync,
  TModifier extends BaseHKTable<RequiredByModifierAsyncHKT>,
  TKeys extends readonly (keyof TEntries)[] | undefined,
  TMessage extends
    | ErrorMessage<InferRequiredByAsyncIssue<TModifier>>
    | undefined,
> = {
  [TKey in keyof TEntries]: TKeys extends readonly (keyof TEntries)[]
    ? TKey extends TKeys[number]
      ? CallHKT<TModifier, [TEntries[TKey], TMessage], 'requiredByAsync'>
      : TEntries[TKey]
    : CallHKT<TModifier, [TEntries[TKey], TMessage], 'requiredByAsync'>;
};

/**
 * Schema with required type.
 */
export type SchemaWithRequiredByAsync<
  TSchema extends Schema,
  TModifier extends BaseHKTable<RequiredByModifierAsyncHKT>,
  TKeys extends ObjectKeys<TSchema> | undefined,
  TMessage extends
    | ErrorMessage<InferRequiredByAsyncIssue<TModifier>>
    | undefined,
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
      readonly entries: RequiredByEntries<TEntries, TModifier, TKeys, TMessage>;
      /**
       * The Standard Schema properties.
       *
       * @internal
       */
      readonly '~standard': StandardProps<
        InferObjectInput<
          RequiredByEntries<TEntries, TModifier, TKeys, TMessage>
        >,
        InferObjectOutput<
          RequiredByEntries<TEntries, TModifier, TKeys, TMessage>
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
      ) => Promise<
        OutputDataset<
          InferObjectOutput<
            RequiredByEntries<TEntries, TModifier, TKeys, TMessage>
          >,
          InferRequiredByAsyncIssue<TModifier> | InferIssue<TSchema>
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
              RequiredByEntries<TEntries, TModifier, TKeys, TMessage>
            >;
            readonly output: InferObjectOutput<
              RequiredByEntries<TEntries, TModifier, TKeys, TMessage>
            >;
            readonly issue:
              | InferRequiredByAsyncIssue<TModifier>
              | InferIssue<TSchema>;
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
        readonly entries: RequiredByEntries<
          TEntries,
          TModifier,
          TKeys,
          TMessage
        >;
        /**
         * The Standard Schema properties.
         *
         * @internal
         */
        readonly '~standard': StandardProps<
          InferObjectInput<
            RequiredByEntries<TEntries, TModifier, TKeys, TMessage>
          > & {
            [key: string]: unknown;
          },
          InferObjectOutput<
            RequiredByEntries<TEntries, TModifier, TKeys, TMessage>
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
        ) => Promise<
          OutputDataset<
            InferObjectOutput<
              RequiredByEntries<TEntries, TModifier, TKeys, TMessage>
            > & {
              [key: string]: unknown;
            },
            InferRequiredByAsyncIssue<TModifier> | InferIssue<TSchema>
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
                RequiredByEntries<TEntries, TModifier, TKeys, TMessage>
              > & {
                [key: string]: unknown;
              };
              readonly output: InferObjectOutput<
                RequiredByEntries<TEntries, TModifier, TKeys, TMessage>
              > & {
                [key: string]: unknown;
              };
              readonly issue:
                | InferRequiredByAsyncIssue<TModifier>
                | InferIssue<TSchema>;
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
          readonly entries: RequiredByEntries<
            TEntries,
            TModifier,
            TKeys,
            TMessage
          >;
          /**
           * The Standard Schema properties.
           *
           * @internal
           */
          readonly '~standard': StandardProps<
            InferObjectInput<
              RequiredByEntries<TEntries, TModifier, TKeys, TMessage>
            > & {
              [key: string]: InferInput<TRest>;
            },
            InferObjectOutput<
              RequiredByEntries<TEntries, TModifier, TKeys, TMessage>
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
          ) => Promise<
            OutputDataset<
              InferObjectOutput<
                RequiredByEntries<TEntries, TModifier, TKeys, TMessage>
              > & {
                [key: string]: InferOutput<TRest>;
              },
              InferRequiredByAsyncIssue<TModifier> | InferIssue<TSchema>
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
                  RequiredByEntries<TEntries, TModifier, TKeys, TMessage>
                > & {
                  [key: string]: InferInput<TRest>;
                };
                readonly output: InferObjectOutput<
                  RequiredByEntries<TEntries, TModifier, TKeys, TMessage>
                > & { [key: string]: InferOutput<TRest> };
                readonly issue:
                  | InferRequiredByAsyncIssue<TModifier>
                  | InferIssue<TSchema>;
              }
            | undefined;
        }
      : never;

/**
 * Creates a modified copy of an object schema that applies a modifier to all entries.
 *
 * @param schema The schema to modify.
 * @param modifier The modifier to apply, e.g. `nonOptionalAsync` or `nonNullableAsync`.
 *
 * @returns An object schema.
 */
export function requiredByAsync<
  const TSchema extends Schema,
  const TModifier extends BaseHKTable<RequiredByModifierAsyncHKT>,
>(
  schema: TSchema,
  modifier: HKTImplementation<TModifier>
): SchemaWithRequiredByAsync<TSchema, TModifier, undefined, undefined>;

/**
 * Creates a modified copy of an object schema that applies a modifier to all entries.
 *
 * @param schema The schema to modify.
 * @param modifier The modifier to apply, e.g. `nonOptionalAsync` or `nonNullableAsync`.
 * @param message The error message.
 *
 * @returns An object schema.
 */
export function requiredByAsync<
  const TSchema extends Schema,
  const TModifier extends BaseHKTable<RequiredByModifierAsyncHKT>,
  const TMessage extends
    | ErrorMessage<InferRequiredByAsyncIssue<TModifier>>
    | undefined,
>(
  schema: TSchema,
  modifier: HKTImplementation<TModifier>,
  message: TMessage
): SchemaWithRequiredByAsync<TSchema, TModifier, undefined, TMessage>;

/**
 * Creates a modified copy of an object schema that applies a modifier to the selected entries.
 *
 * @param schema The schema to modify.
 * @param modifier The modifier to apply, e.g. `nonOptionalAsync` or `nonNullableAsync`.
 * @param keys The selected entries.
 *
 * @returns An object schema.
 */
export function requiredByAsync<
  const TSchema extends Schema,
  const TModifier extends BaseHKTable<RequiredByModifierAsyncHKT>,
  const TKeys extends ObjectKeys<TSchema>,
>(
  schema: TSchema,
  modifier: HKTImplementation<TModifier>,
  keys: TKeys
): SchemaWithRequiredByAsync<TSchema, TModifier, TKeys, undefined>;

/**
 * Creates a modified copy of an object schema that applies a modifier to the selected entries.
 *
 * @param schema The schema to modify.
 * @param modifier The modifier to apply, e.g. `nonOptionalAsync` or `nonNullableAsync`.
 * @param keys The selected entries.
 * @param message The error message.
 *
 * @returns An object schema.
 */
export function requiredByAsync<
  const TSchema extends Schema,
  const TModifier extends BaseHKTable<RequiredByModifierAsyncHKT>,
  const TKeys extends ObjectKeys<TSchema>,
  const TMessage extends
    | ErrorMessage<InferRequiredByAsyncIssue<TModifier>>
    | undefined,
>(
  schema: TSchema,
  modifier: HKTImplementation<TModifier>,
  keys: TKeys,
  message: TMessage
): SchemaWithRequiredByAsync<TSchema, TModifier, TKeys, TMessage>;

// @__NO_SIDE_EFFECTS__
export function requiredByAsync(
  schema: Schema,
  modifier: HKTImplementation<BaseHKTable<RequiredByModifierAsyncHKT>>,
  arg2?:
    | ErrorMessage<
        InferRequiredByAsyncIssue<BaseHKTable<RequiredByModifierAsyncHKT>>
      >
    | ObjectKeys<Schema>,
  arg3?: ErrorMessage<
    InferRequiredByAsyncIssue<BaseHKTable<RequiredByModifierAsyncHKT>>
  >
): SchemaWithRequiredByAsync<
  Schema,
  BaseHKTable<RequiredByModifierAsyncHKT>,
  ObjectKeys<Schema> | undefined,
  | ErrorMessage<
      InferRequiredByAsyncIssue<BaseHKTable<RequiredByModifierAsyncHKT>>
    >
  | undefined
> {
  // Get keys and message from arguments
  const keys = Array.isArray(arg2) ? arg2 : undefined;
  const message = (Array.isArray(arg2) ? arg3 : arg2) as
    | ErrorMessage<
        InferRequiredByAsyncIssue<BaseHKTable<RequiredByModifierAsyncHKT>>
      >
    | undefined;

  // Create modified object entries
  const entries: RequiredByEntries<
    ObjectEntriesAsync,
    BaseHKTable<RequiredByModifierAsyncHKT>,
    ObjectKeys<Schema>,
    | ErrorMessage<
        InferRequiredByAsyncIssue<BaseHKTable<RequiredByModifierAsyncHKT>>
      >
    | undefined
  > = {};
  for (const key in schema.entries) {
    entries[key] =
      !keys || keys.includes(key)
        ? modifier(schema.entries[key], message)
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
