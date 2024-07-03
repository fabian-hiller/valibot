import type {
  ArrayIssue,
  ArraySchema,
  ArraySchemaAsync,
  IntersectIssue,
  IntersectSchema,
  IntersectSchemaAsync,
  LazySchema,
  LazySchemaAsync,
  LooseObjectIssue,
  LooseObjectSchema,
  LooseObjectSchemaAsync,
  LooseTupleIssue,
  LooseTupleSchema,
  LooseTupleSchemaAsync,
  MapIssue,
  MapSchema,
  MapSchemaAsync,
  NonNullableIssue,
  NonNullableSchema,
  NonNullableSchemaAsync,
  NonNullishIssue,
  NonNullishSchema,
  NonNullishSchemaAsync,
  NonOptionalIssue,
  NonOptionalSchema,
  NonOptionalSchemaAsync,
  NullableSchema,
  NullableSchemaAsync,
  NullishSchema,
  NullishSchemaAsync,
  ObjectIssue,
  ObjectSchema,
  ObjectSchemaAsync,
  ObjectWithRestIssue,
  ObjectWithRestSchema,
  ObjectWithRestSchemaAsync,
  OptionalSchema,
  OptionalSchemaAsync,
  RecordIssue,
  RecordSchema,
  RecordSchemaAsync,
  SetIssue,
  SetSchema,
  SetSchemaAsync,
  StrictObjectIssue,
  StrictObjectSchema,
  StrictObjectSchemaAsync,
  StrictTupleIssue,
  StrictTupleSchema,
  StrictTupleSchemaAsync,
  TupleIssue,
  TupleSchema,
  TupleSchemaAsync,
  TupleWithRestIssue,
  TupleWithRestSchema,
  TupleWithRestSchemaAsync,
  UnionIssue,
  UnionSchema,
  UnionSchemaAsync,
} from '../schemas/index.ts';
import type { Config } from './config.ts';
import type { InferInput } from './infer.ts';
import type { ObjectEntries, ObjectEntriesAsync } from './object.ts';
import type { Default, DefaultAsync, ErrorMessage } from './other.ts';
import type { BaseSchema, BaseSchemaAsync } from './schema.ts';
import type { TupleItems, TupleItemsAsync } from './tuple.ts';
import type { MaybeReadonly } from './utils.ts';

/**
 * Array path item type.
 */
export interface ArrayPathItem {
  /**
   * The path item type.
   */
  readonly type: 'array';
  /**
   * The path item origin.
   */
  readonly origin: 'value';
  /**
   * The path item input.
   */
  readonly input: MaybeReadonly<unknown[]>;
  /**
   * The path item key.
   */
  readonly key: number;
  /**
   * The path item value.
   */
  readonly value: unknown;
}

/**
 * Map path item type.
 */
export interface MapPathItem {
  /**
   * The path item type.
   */
  readonly type: 'map';
  /**
   * The path item origin.
   */
  readonly origin: 'key' | 'value';
  /**
   * The path item input.
   */
  readonly input: Map<unknown, unknown>;
  /**
   * The path item key.
   */
  readonly key: unknown;
  /**
   * The path item value.
   */
  readonly value: unknown;
}

/**
 * Object path item type.
 */
export interface ObjectPathItem {
  /**
   * The path item type.
   */
  readonly type: 'object';
  /**
   * The path item origin.
   */
  readonly origin: 'key' | 'value';
  /**
   * The path item input.
   */
  readonly input: Record<string, unknown>;
  /**
   * The path item key.
   */
  readonly key: string;
  /**
   * The path item value.
   */
  readonly value: unknown;
}

/**
 * Set path item type.
 *
 * TODO: Should we add `key: undefined` to make working with path keys easier?
 */
export interface SetPathItem {
  /**
   * The path item type.
   */
  readonly type: 'set';
  /**
   * The path item origin.
   */
  readonly origin: 'value';
  /**
   * The path item input.
   */
  readonly input: Set<unknown>;
  /**
   * The path item key.
   */
  readonly value: unknown;
}

/**
 * Unknown path item type.
 */
export interface UnknownPathItem {
  /**
   * The path item type.
   */
  readonly type: 'unknown';
  /**
   * The path item origin.
   */
  readonly origin: 'key' | 'value';
  /**
   * The path item input.
   */
  readonly input: unknown;
  /**
   * The path item key.
   */
  readonly key: unknown;
  /**
   * The path item value.
   */
  readonly value: unknown;
}

/**
 * Issue path item type.
 *
 * TODO: Document that the input of the path may be different from the input of
 * the issue.
 */
export type IssuePathItem =
  | ArrayPathItem
  | MapPathItem
  | ObjectPathItem
  | SetPathItem
  | UnknownPathItem;

/**
 * Base issue type.
 */
export interface BaseIssue<TInput> extends Config<BaseIssue<TInput>> {
  /**
   * The issue kind.
   */
  readonly kind: 'schema' | 'validation' | 'transformation';
  /**
   * The issue type.
   */
  readonly type: string;
  /**
   * The raw input data.
   */
  readonly input: TInput;
  /**
   * The expected property.
   */
  readonly expected: string | null;
  /**
   * The received property.
   */
  readonly received: string;
  /**
   * The error message.
   */
  readonly message: string;
  /**
   * The input requirement.
   */
  readonly requirement?: unknown;
  /**
   * The issue path.
   *
   * TODO: Investigate if it is possible to make the path type safe based on the
   * input.
   */
  readonly path?: [IssuePathItem, ...IssuePathItem[]];
  /**
   * The sub issues.
   */
  readonly issues?: [BaseIssue<TInput>, ...BaseIssue<TInput>[]];
}

/**
 * Generic issue type.
 */
export interface GenericIssue<TInput = unknown> extends BaseIssue<TInput> {}

/**
 * Dot path type.
 */
type DotPath<
  TKey extends string | number | symbol,
  TSchema extends
    | BaseSchema<unknown, unknown, BaseIssue<unknown>>
    | BaseSchemaAsync<unknown, unknown, BaseIssue<unknown>>,
> = TKey extends string | number
  ? `${TKey}` | `${TKey}.${IssueDotPath<TSchema>}`
  : never;

/**
 * Object path type.
 */
type ObjectPath<TEntries extends ObjectEntries | ObjectEntriesAsync> = {
  [TKey in keyof TEntries]: DotPath<TKey, TEntries[TKey]>;
}[keyof TEntries];

/**
 * Tuple keys type.
 */
type TupleKeys<TItems extends TupleItems | TupleItemsAsync> = Exclude<
  keyof TItems,
  keyof []
>;

/**
 * Tuple path type.
 */
type TuplePath<TItems extends TupleItems | TupleItemsAsync> = {
  // @ts-expect-error
  [TKey in TupleKeys<TItems>]: DotPath<TKey, TItems[TKey]>;
}[TupleKeys<TItems>];

/**
 * Issue dot path type.
 */
export type IssueDotPath<
  TSchema extends
    | BaseSchema<unknown, unknown, BaseIssue<unknown>>
    | BaseSchemaAsync<unknown, unknown, BaseIssue<unknown>>,
> =
  // Array
  TSchema extends
    | ArraySchema<infer TItem, ErrorMessage<ArrayIssue> | undefined>
    | ArraySchemaAsync<infer TItem, ErrorMessage<ArrayIssue> | undefined>
    ? DotPath<number, TItem>
    : // Intersect, Union or Variant
      TSchema extends
          | IntersectSchema<
              infer TOptions,
              ErrorMessage<IntersectIssue> | undefined
            >
          | IntersectSchemaAsync<
              infer TOptions,
              ErrorMessage<IntersectIssue> | undefined
            >
          | UnionSchema<
              infer TOptions,
              ErrorMessage<UnionIssue<BaseIssue<unknown>>> | undefined
            >
          | UnionSchemaAsync<
              infer TOptions,
              ErrorMessage<UnionIssue<BaseIssue<unknown>>> | undefined
            >
      ? // FIXME: Type instantiation is excessively deep and possibly infinite
        // | VariantSchema<
        //     string,
        //     infer TOptions,
        //     ErrorMessage<VariantIssue> | undefined
        //   >
        // | VariantSchemaAsync<
        //     string,
        //     infer TOptions,
        //     ErrorMessage<VariantIssue> | undefined
        //   >
        IssueDotPath<TOptions[number]>
      : // Map or Record
        TSchema extends
            | MapSchema<
                infer TKey,
                infer TValue,
                ErrorMessage<MapIssue> | undefined
              >
            | MapSchemaAsync<
                infer TKey,
                infer TValue,
                ErrorMessage<MapIssue> | undefined
              >
            | RecordSchema<
                infer TKey,
                infer TValue,
                ErrorMessage<RecordIssue> | undefined
              >
            | RecordSchemaAsync<
                infer TKey,
                infer TValue,
                ErrorMessage<RecordIssue> | undefined
              >
        ? DotPath<InferInput<TKey>, TValue>
        : // Object
          TSchema extends
              | LooseObjectSchema<
                  infer TEntries,
                  ErrorMessage<LooseObjectIssue> | undefined
                >
              | LooseObjectSchemaAsync<
                  infer TEntries,
                  ErrorMessage<LooseObjectIssue> | undefined
                >
              | ObjectSchema<
                  infer TEntries,
                  ErrorMessage<ObjectIssue> | undefined
                >
              | ObjectSchemaAsync<
                  infer TEntries,
                  ErrorMessage<ObjectIssue> | undefined
                >
              | StrictObjectSchema<
                  infer TEntries,
                  ErrorMessage<StrictObjectIssue> | undefined
                >
              | StrictObjectSchemaAsync<
                  infer TEntries,
                  ErrorMessage<StrictObjectIssue> | undefined
                >
          ? ObjectPath<TEntries>
          : // Object with Rest
            TSchema extends
                | ObjectWithRestSchema<
                    ObjectEntries,
                    BaseSchema<unknown, unknown, BaseIssue<unknown>>,
                    ErrorMessage<ObjectWithRestIssue> | undefined
                  >
                | ObjectWithRestSchemaAsync<
                    ObjectEntriesAsync,
                    | BaseSchema<unknown, unknown, BaseIssue<unknown>>
                    | BaseSchemaAsync<unknown, unknown, BaseIssue<unknown>>,
                    ErrorMessage<ObjectWithRestIssue> | undefined
                  >
            ? string
            : // Set
              TSchema extends
                  | SetSchema<infer TValue, ErrorMessage<SetIssue> | undefined>
                  | SetSchemaAsync<
                      infer TValue,
                      ErrorMessage<SetIssue> | undefined
                    >
              ? DotPath<number, TValue>
              : // Tuple
                TSchema extends
                    | LooseTupleSchema<
                        infer TItems,
                        ErrorMessage<LooseTupleIssue> | undefined
                      >
                    | LooseTupleSchemaAsync<
                        infer TItems,
                        ErrorMessage<LooseTupleIssue> | undefined
                      >
                    | StrictTupleSchema<
                        infer TItems,
                        ErrorMessage<StrictTupleIssue> | undefined
                      >
                    | StrictTupleSchemaAsync<
                        infer TItems,
                        ErrorMessage<StrictTupleIssue> | undefined
                      >
                    | TupleSchema<
                        infer TItems,
                        ErrorMessage<TupleIssue> | undefined
                      >
                    | TupleSchemaAsync<
                        infer TItems,
                        ErrorMessage<TupleIssue> | undefined
                      >
                ? TuplePath<TItems>
                : // Tuple with Rest
                  TSchema extends
                      | TupleWithRestSchema<
                          infer TItems,
                          infer TRest,
                          ErrorMessage<TupleWithRestIssue> | undefined
                        >
                      | TupleWithRestSchemaAsync<
                          infer TItems,
                          infer TRest,
                          ErrorMessage<TupleWithRestIssue> | undefined
                        >
                  ? TuplePath<TItems> | DotPath<number, TRest>
                  : // Wrapped
                    TSchema extends
                        | LazySchema<infer TWrapped>
                        | LazySchemaAsync<infer TWrapped>
                        | NonNullableSchema<
                            infer TWrapped,
                            ErrorMessage<NonNullableIssue> | undefined
                          >
                        | NonNullableSchemaAsync<
                            infer TWrapped,
                            ErrorMessage<NonNullableIssue> | undefined
                          >
                        | NonNullishSchema<
                            infer TWrapped,
                            ErrorMessage<NonNullishIssue> | undefined
                          >
                        | NonNullishSchemaAsync<
                            infer TWrapped,
                            ErrorMessage<NonNullishIssue> | undefined
                          >
                        | NonOptionalSchema<
                            infer TWrapped,
                            ErrorMessage<NonOptionalIssue> | undefined
                          >
                        | NonOptionalSchemaAsync<
                            infer TWrapped,
                            ErrorMessage<NonOptionalIssue> | undefined
                          >
                        | NullableSchema<
                            infer TWrapped,
                            Default<
                              BaseSchema<unknown, unknown, BaseIssue<unknown>>,
                              null
                            >
                          >
                        | NullableSchemaAsync<
                            infer TWrapped,
                            DefaultAsync<
                              | BaseSchema<unknown, unknown, BaseIssue<unknown>>
                              | BaseSchemaAsync<
                                  unknown,
                                  unknown,
                                  BaseIssue<unknown>
                                >,
                              null
                            >
                          >
                        | NullishSchema<
                            infer TWrapped,
                            Default<
                              BaseSchema<unknown, unknown, BaseIssue<unknown>>,
                              null | undefined
                            >
                          >
                        | NullishSchemaAsync<
                            infer TWrapped,
                            DefaultAsync<
                              | BaseSchema<unknown, unknown, BaseIssue<unknown>>
                              | BaseSchemaAsync<
                                  unknown,
                                  unknown,
                                  BaseIssue<unknown>
                                >,
                              null | undefined
                            >
                          >
                        | OptionalSchema<
                            infer TWrapped,
                            Default<
                              BaseSchema<unknown, unknown, BaseIssue<unknown>>,
                              undefined
                            >
                          >
                        | OptionalSchemaAsync<
                            infer TWrapped,
                            DefaultAsync<
                              | BaseSchema<unknown, unknown, BaseIssue<unknown>>
                              | BaseSchemaAsync<
                                  unknown,
                                  unknown,
                                  BaseIssue<unknown>
                                >,
                              undefined
                            >
                          >
                    ? IssueDotPath<TWrapped>
                    : // Otherwise
                      never;
