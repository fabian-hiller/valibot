import type {
  LooseObjectIssue,
  LooseObjectSchema,
  LooseObjectSchemaAsync,
  NeverIssue,
  NeverSchema,
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
  StrictObjectIssue,
  StrictObjectSchema,
  StrictObjectSchemaAsync,
} from '../schemas/index.ts';
import type { InferInput, InferIssue, InferOutput } from './infer.ts';
import type { BaseIssue } from './issue.ts';
import type { Default, DefaultAsync, ErrorMessage } from './other.ts';
import type { BaseSchema, BaseSchemaAsync } from './schema.ts';
import type { MaybeReadonly, ResolveObject } from './utils.ts';

/**
 * Object path item type.
 */
export interface ObjectPathItem {
  type: 'object';
  origin: 'value';
  input: Record<string, unknown>;
  key: string;
  value: unknown;
}

/**
 * Object entries type.
 */
export interface ObjectEntries {
  [key: string]: BaseSchema<unknown, unknown, BaseIssue<unknown>>;
}

/**
 * Object entries async type.
 */
export interface ObjectEntriesAsync {
  [key: string]:
    | BaseSchema<unknown, unknown, BaseIssue<unknown>>
    | BaseSchemaAsync<unknown, unknown, BaseIssue<unknown>>;
}

/**
 * Object keys type.
 * TODO: Where do we need this type?
 * TODO: Add strict object and object with rest types.
 */
export type ObjectKeys<
  TSchema extends
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
      >,
> = MaybeReadonly<[keyof TSchema['entries'], ...(keyof TSchema['entries'])[]]>;

/**
 * Required object keys type.
 */
type RequiredKeys<
  TEntries extends ObjectEntries | ObjectEntriesAsync,
  TObject extends EntriesInput<TEntries> | EntriesOutput<TEntries>,
> = {
  [TKey in keyof TEntries]: TEntries[TKey] extends
    | NullishSchema<
        BaseSchema<unknown, unknown, BaseIssue<unknown>>,
        Default<BaseSchema<unknown, unknown, BaseIssue<unknown>>>
      >
    | NullishSchemaAsync<
        | BaseSchema<unknown, unknown, BaseIssue<unknown>>
        | BaseSchemaAsync<unknown, unknown, BaseIssue<unknown>>,
        DefaultAsync<
          | BaseSchema<unknown, unknown, BaseIssue<unknown>>
          | BaseSchemaAsync<unknown, unknown, BaseIssue<unknown>>
        >
      >
    | OptionalSchema<
        BaseSchema<unknown, unknown, BaseIssue<unknown>>,
        Default<BaseSchema<unknown, unknown, BaseIssue<unknown>>>
      >
    | OptionalSchemaAsync<
        | BaseSchema<unknown, unknown, BaseIssue<unknown>>
        | BaseSchemaAsync<unknown, unknown, BaseIssue<unknown>>,
        DefaultAsync<
          | BaseSchema<unknown, unknown, BaseIssue<unknown>>
          | BaseSchemaAsync<unknown, unknown, BaseIssue<unknown>>
        >
      >
    ? undefined extends TObject[TKey]
      ? never
      : TKey
    : TKey;
}[keyof TEntries];

/**
 * Optional object keys type.
 */
type OptionalKeys<
  TEntries extends ObjectEntries | ObjectEntriesAsync,
  TObject extends EntriesInput<TEntries> | EntriesOutput<TEntries>,
> = {
  [TKey in keyof TEntries]: TEntries[TKey] extends
    | NullishSchema<
        BaseSchema<unknown, unknown, BaseIssue<unknown>>,
        Default<BaseSchema<unknown, unknown, BaseIssue<unknown>>>
      >
    | NullishSchemaAsync<
        | BaseSchema<unknown, unknown, BaseIssue<unknown>>
        | BaseSchemaAsync<unknown, unknown, BaseIssue<unknown>>,
        DefaultAsync<
          | BaseSchema<unknown, unknown, BaseIssue<unknown>>
          | BaseSchemaAsync<unknown, unknown, BaseIssue<unknown>>
        >
      >
    | OptionalSchema<
        BaseSchema<unknown, unknown, BaseIssue<unknown>>,
        Default<BaseSchema<unknown, unknown, BaseIssue<unknown>>>
      >
    | OptionalSchemaAsync<
        | BaseSchema<unknown, unknown, BaseIssue<unknown>>
        | BaseSchemaAsync<unknown, unknown, BaseIssue<unknown>>,
        DefaultAsync<
          | BaseSchema<unknown, unknown, BaseIssue<unknown>>
          | BaseSchemaAsync<unknown, unknown, BaseIssue<unknown>>
        >
      >
    ? undefined extends TObject[TKey]
      ? TKey
      : never
    : never;
}[keyof TEntries];

/**
 * Entries input inference type.
 */
type EntriesInput<TEntries extends ObjectEntries | ObjectEntriesAsync> = {
  -readonly [TKey in keyof TEntries]: InferInput<TEntries[TKey]>;
};

/**
 * Entries output inference type.
 */
type EntriesOutput<TEntries extends ObjectEntries | ObjectEntriesAsync> = {
  -readonly [TKey in keyof TEntries]: InferOutput<TEntries[TKey]>;
};

/**
 * Object with question marks type.
 */
type WithQuestionMarks<
  TEntries extends ObjectEntries | ObjectEntriesAsync,
  TObject extends EntriesInput<TEntries> | EntriesOutput<TEntries>,
> = Pick<TObject, RequiredKeys<TEntries, TObject>> &
  Partial<Pick<TObject, OptionalKeys<TEntries, TObject>>>;

/**
 * Infer object input type.
 */
export type InferObjectInput<
  TEntries extends ObjectEntries | ObjectEntriesAsync,
  TRest extends
    | BaseSchema<unknown, unknown, BaseIssue<unknown>>
    | BaseSchemaAsync<unknown, unknown, BaseIssue<unknown>>
    | undefined,
> = TRest extends NeverSchema<ErrorMessage<NeverIssue> | undefined> | undefined
  ? ResolveObject<WithQuestionMarks<TEntries, EntriesInput<TEntries>>>
  : TRest extends
        | BaseSchema<unknown, unknown, BaseIssue<unknown>>
        | BaseSchemaAsync<unknown, unknown, BaseIssue<unknown>>
    ? ResolveObject<WithQuestionMarks<TEntries, EntriesInput<TEntries>>> & {
        [key: string]: InferInput<TRest>;
      }
    : never;

/**
 * Infer object output type.
 */
export type InferObjectOutput<
  TEntries extends ObjectEntries | ObjectEntriesAsync,
  TRest extends
    | BaseSchema<unknown, unknown, BaseIssue<unknown>>
    | BaseSchemaAsync<unknown, unknown, BaseIssue<unknown>>
    | undefined,
> = TRest extends NeverSchema<ErrorMessage<NeverIssue> | undefined> | undefined
  ? ResolveObject<WithQuestionMarks<TEntries, EntriesOutput<TEntries>>>
  : TRest extends
        | BaseSchema<unknown, unknown, BaseIssue<unknown>>
        | BaseSchemaAsync<unknown, unknown, BaseIssue<unknown>>
    ? ResolveObject<WithQuestionMarks<TEntries, EntriesOutput<TEntries>>> & {
        [key: string]: InferOutput<TRest>;
      }
    : never;

/**
 * Infer object issue type.
 */
export type InferObjectIssue<
  TEntries extends ObjectEntries | ObjectEntriesAsync,
  TRest extends
    | BaseSchema<unknown, unknown, BaseIssue<unknown>>
    | BaseSchemaAsync<unknown, unknown, BaseIssue<unknown>>
    | undefined,
> = TRest extends
  | BaseSchema<unknown, unknown, BaseIssue<unknown>>
  | BaseSchemaAsync<unknown, unknown, BaseIssue<unknown>>
  ? InferIssue<TEntries[keyof TEntries]> | InferIssue<TRest>
  : InferIssue<TEntries[keyof TEntries]>;

/**
 * Infer object rest type.
 */
export type InferObjectRest<
  TSchema extends
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
      >,
> = TSchema extends
  | ObjectWithRestSchema<
      ObjectEntries,
      BaseSchema<unknown, unknown, BaseIssue<unknown>>,
      ErrorMessage<ObjectWithRestIssue> | undefined
    >
  | StrictObjectSchema<
      ObjectEntries,
      ErrorMessage<StrictObjectIssue | NeverIssue> | undefined
    >
  ? TSchema['rest']
  : undefined;
