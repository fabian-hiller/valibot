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
  VariantIssue,
  VariantSchema,
  VariantSchemaAsync,
} from '../../schemas/index.ts';
import type {
  BaseIssue,
  BaseSchema,
  BaseSchemaAsync,
  Default,
  DefaultAsync,
  ErrorMessage,
  InferInput,
  InferIssue,
  ObjectEntries,
  ObjectEntriesAsync,
  Prettify,
  TupleItems,
  TupleItemsAsync,
} from '../../types/index.ts';

// TODO: Add unit and type tests for flatten method

/**
 * Dot path type.
 */
type DotPath<
  TKey extends string | number | symbol,
  TSchema extends
    | BaseSchema<unknown, unknown, BaseIssue<unknown>>
    | BaseSchemaAsync<unknown, unknown, BaseIssue<unknown>>,
> = TKey extends string | number
  ? // @ts-expect-error
    `${TKey}` | `${TKey}.${NestedPath<TSchema>}`
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
 * Nested path type.
 */
type NestedPath<
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
          | VariantSchema<
              string,
              infer TOptions,
              ErrorMessage<VariantIssue> | undefined
            >
          | VariantSchemaAsync<
              string,
              infer TOptions,
              ErrorMessage<VariantIssue> | undefined
            >
      ? NestedPath<TOptions[number]>
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
                    ? NestedPath<TWrapped>
                    : // Otherwise
                      never;

/**
 * Flat errors type.
 */
export interface FlatErrors<
  TSchema extends
    | BaseSchema<unknown, unknown, BaseIssue<unknown>>
    | BaseSchemaAsync<unknown, unknown, BaseIssue<unknown>>,
> {
  /**
   * The root errors.
   */
  readonly root?: [string, ...string[]];
  /**
   * The unknown errors.
   */
  readonly unknown?: [string, ...string[]];
  /**
   * The nested errors.
   */
  readonly nested?: Prettify<
    Readonly<Partial<Record<NestedPath<TSchema>, [string, ...string[]]>>>
  >;
}

/**
 * Flatten the error messages of schema issues.
 *
 * @param issues The schema issues.
 *
 * @returns A flat error object.
 */
export function flatten<
  TSchema extends
    | BaseSchema<unknown, unknown, BaseIssue<unknown>>
    | BaseSchemaAsync<unknown, unknown, BaseIssue<unknown>>,
>(
  issues: [InferIssue<TSchema>, ...InferIssue<TSchema>[]]
): Prettify<FlatErrors<TSchema>> {
  // Create flat errors object
  const flatErrors: FlatErrors<TSchema> = {};

  // Add message of each issue to flat errors object
  for (const issue of issues) {
    // If issue has path, add message to nested or unknown errors
    if (issue.path) {
      // If path has valid keys, add message to nested errors
      if (
        issue.path.every(
          (item) =>
            'key' in item &&
            (typeof item.key === 'string' || typeof item.key === 'number')
        )
      ) {
        const path = issue.path
          // @ts-expect-error
          .map(({ key }) => key)
          .join('.') as NestedPath<TSchema>;
        if (!flatErrors.nested) {
          // @ts-expect-error
          flatErrors.nested = {};
        }
        if (flatErrors.nested![path]) {
          flatErrors.nested![path]!.push(issue.message);
        } else {
          flatErrors.nested![path] = [issue.message];
        }

        // Otherwise, add message to unknown errors
      } else {
        if (flatErrors.unknown) {
          flatErrors.unknown.push(issue.message);
        } else {
          // @ts-expect-error
          flatErrors.unknown = [issue.message];
        }
      }

      // Otherwise, add message to root errors
    } else {
      if (flatErrors.root) {
        flatErrors.root.push(issue.message);
      } else {
        // @ts-expect-error
        flatErrors.root = [issue.message];
      }
    }
  }

  // Return flat errors object
  return flatErrors;
}
