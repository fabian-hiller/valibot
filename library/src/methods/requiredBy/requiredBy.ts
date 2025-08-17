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
  BaseHKT,
  BaseHKTable,
  BaseIssue,
  BaseSchema,
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
 * Required by modifier.
 *
 * requiredBy: (schema: BaseSchema<unknown, unknown, BaseIssue<unknown>>) => BaseSchema<unknown, unknown, BaseIssue<unknown>>
 */
export interface RequiredByModifierHKT extends BaseHKT<'requiredBy'> {
  argConstraint: [
    schema: BaseSchema<unknown, unknown, BaseIssue<unknown>>,
    message: ErrorMessage<this['issue']> | undefined,
  ];
  result: BaseSchema<unknown, unknown, BaseIssue<unknown>>;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  issue: any;

  schema: this['args'][0];
  message: this['args'][1];
}

type InferRequiredByIssue<
  TModifier extends BaseHKTable<RequiredByModifierHKT>,
> = InferHKT<TModifier>['issue'];

/**
 * Required entries type.
 */
type RequiredByEntries<
  TEntries extends ObjectEntries,
  TModifier extends BaseHKTable<RequiredByModifierHKT>,
  TKeys extends readonly (keyof TEntries)[] | undefined,
  TMessage extends ErrorMessage<InferRequiredByIssue<TModifier>> | undefined,
> = {
  [TKey in keyof TEntries]: TKeys extends readonly (keyof TEntries)[]
    ? TKey extends TKeys[number]
      ? CallHKT<TModifier, [TEntries[TKey], TMessage], 'requiredBy'>
      : TEntries[TKey]
    : CallHKT<TModifier, [TEntries[TKey], TMessage], 'requiredBy'>;
};

/**
 * Schema with required type.
 */
export type SchemaWithRequiredBy<
  TSchema extends Schema,
  TModifier extends BaseHKTable<RequiredByModifierHKT>,
  TKeys extends ObjectKeys<TSchema> | undefined,
  TMessage extends ErrorMessage<InferRequiredByIssue<TModifier>> | undefined,
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
      ) => OutputDataset<
        InferObjectOutput<
          RequiredByEntries<TEntries, TModifier, TKeys, TMessage>
        >,
        InferRequiredByIssue<TModifier> | InferIssue<TSchema>
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
              | InferRequiredByIssue<TModifier>
              | InferIssue<TSchema>;
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
        ) => OutputDataset<
          InferObjectOutput<
            RequiredByEntries<TEntries, TModifier, TKeys, TMessage>
          > & {
            [key: string]: unknown;
          },
          InferRequiredByIssue<TModifier> | InferIssue<TSchema>
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
                | InferRequiredByIssue<TModifier>
                | InferIssue<TSchema>;
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
          ) => OutputDataset<
            InferObjectOutput<
              RequiredByEntries<TEntries, TModifier, TKeys, TMessage>
            > & {
              [key: string]: InferOutput<TRest>;
            },
            InferRequiredByIssue<TModifier> | InferIssue<TSchema>
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
                  | InferRequiredByIssue<TModifier>
                  | InferIssue<TSchema>;
              }
            | undefined;
        }
      : never;

/**
 * Creates a modified copy of an object schema that applies a modifier to all entries.
 *
 * @param schema The schema to modify.
 * @param modifier The modifier to apply, e.g. `nonOptional` or `nonNullable`.
 *
 * @returns An object schema.
 */
export function requiredBy<
  const TSchema extends Schema,
  const TModifier extends BaseHKTable<RequiredByModifierHKT>,
>(
  schema: TSchema,
  modifier: HKTImplementation<TModifier>
): SchemaWithRequiredBy<TSchema, TModifier, undefined, undefined>;

/**
 * Creates a modified copy of an object schema that applies a modifier to all entries.
 *
 * @param schema The schema to modify.
 * @param modifier The modifier to apply, e.g. `nonOptional` or `nonNullable`.
 * @param message The error message.
 *
 * @returns An object schema.
 */
export function requiredBy<
  const TSchema extends Schema,
  const TModifier extends BaseHKTable<RequiredByModifierHKT>,
  const TMessage extends
    | ErrorMessage<InferRequiredByIssue<TModifier>>
    | undefined,
>(
  schema: TSchema,
  modifier: HKTImplementation<TModifier>,
  message: TMessage
): SchemaWithRequiredBy<TSchema, TModifier, undefined, TMessage>;

/**
 * Creates a modified copy of an object schema that applies a modifier to the selected entries.
 *
 * @param schema The schema to modify.
 * @param modifier The modifier to apply, e.g. `nonOptional` or `nonNullable`.
 * @param keys The selected entries.
 *
 * @returns An object schema.
 */
export function requiredBy<
  const TSchema extends Schema,
  const TModifier extends BaseHKTable<RequiredByModifierHKT>,
  const TKeys extends ObjectKeys<TSchema>,
>(
  schema: TSchema,
  modifier: HKTImplementation<TModifier>,
  keys: TKeys
): SchemaWithRequiredBy<TSchema, TModifier, TKeys, undefined>;

/**
 * Creates a modified copy of an object schema that applies a modifier to the selected entries.
 *
 * @param schema The schema to modify.
 * @param modifier The modifier to apply, e.g. `nonOptional` or `nonNullable`.
 * @param keys The selected entries.
 * @param message The error message.
 *
 * @returns An object schema.
 */
export function requiredBy<
  const TSchema extends Schema,
  const TModifier extends BaseHKTable<RequiredByModifierHKT>,
  const TKeys extends ObjectKeys<TSchema>,
  const TMessage extends
    | ErrorMessage<InferRequiredByIssue<TModifier>>
    | undefined,
>(
  schema: TSchema,
  modifier: HKTImplementation<TModifier>,
  keys: TKeys,
  message: TMessage
): SchemaWithRequiredBy<TSchema, TModifier, TKeys, TMessage>;

// @__NO_SIDE_EFFECTS__
export function requiredBy(
  schema: Schema,
  modifier: HKTImplementation<BaseHKTable<RequiredByModifierHKT>>,
  arg2?:
    | ErrorMessage<InferHKT<BaseHKTable<RequiredByModifierHKT>>['issue']>
    | ObjectKeys<Schema>,
  arg3?: ErrorMessage<InferHKT<BaseHKTable<RequiredByModifierHKT>>['issue']>
): SchemaWithRequiredBy<
  Schema,
  BaseHKTable<RequiredByModifierHKT>,
  ObjectKeys<Schema> | undefined,
  ErrorMessage<BaseIssue<unknown>> | undefined
> {
  // Get keys and message from arguments
  const keys = Array.isArray(arg2) ? arg2 : undefined;
  const message = (Array.isArray(arg2) ? arg3 : arg2) as
    | ErrorMessage<BaseIssue<unknown>>
    | undefined;

  // Create modified object entries
  const entries: RequiredByEntries<
    ObjectEntries,
    BaseHKTable<RequiredByModifierHKT>,
    ObjectKeys<Schema>,
    ErrorMessage<BaseIssue<unknown>> | undefined
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
