import type { SchemaWithPipe, SchemaWithPipeAsync } from '../methods/index.ts';
import type {
  LooseObjectIssue,
  LooseObjectSchema,
  LooseObjectSchemaAsync,
  ObjectIssue,
  ObjectSchema,
  ObjectSchemaAsync,
  ObjectWithRestIssue,
  ObjectWithRestSchema,
  ObjectWithRestSchemaAsync,
  StrictObjectIssue,
  StrictObjectSchema,
  StrictObjectSchemaAsync,
} from '../schemas/index.ts';
import type { InferInput, InferIssue, InferOutput } from './infer.ts';
import type { BaseIssue } from './issue.ts';
import type {
  ErrorMessage,
  QuestionMarkSchema,
  QuestionMarkSchemaAsync,
} from './other.ts';
import type { PipeItem, PipeItemAsync } from './pipe.ts';
import type { BaseSchema, BaseSchemaAsync } from './schema.ts';
import type { MarkOptional, MaybeReadonly, Prettify } from './utils.ts';

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
 */
export type ObjectKeys<
  TSchema extends
    | LooseObjectSchema<
        ObjectEntries,
        ErrorMessage<LooseObjectIssue> | undefined
      >
    | LooseObjectSchemaAsync<
        ObjectEntriesAsync,
        ErrorMessage<LooseObjectIssue> | undefined
      >
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
        | BaseSchema<unknown, unknown, BaseIssue<unknown>>
        | BaseSchemaAsync<unknown, unknown, BaseIssue<unknown>>,
        ErrorMessage<ObjectWithRestIssue> | undefined
      >
    | StrictObjectSchema<
        ObjectEntries,
        ErrorMessage<StrictObjectIssue> | undefined
      >
    | StrictObjectSchemaAsync<
        ObjectEntriesAsync,
        ErrorMessage<StrictObjectIssue> | undefined
      >,
> = MaybeReadonly<[keyof TSchema['entries'], ...(keyof TSchema['entries'])[]]>;

/**
 * Infer entries input type.
 */
type InferEntriesInput<TEntries extends ObjectEntries | ObjectEntriesAsync> = {
  -readonly [TKey in keyof TEntries]: InferInput<TEntries[TKey]>;
};

/**
 * Infer entries output type.
 */
type InferEntriesOutput<TEntries extends ObjectEntries | ObjectEntriesAsync> = {
  -readonly [TKey in keyof TEntries]: InferOutput<TEntries[TKey]>;
};

/**
 * Optional keys type.
 */
type OptionalKeys<
  TEntries extends ObjectEntries | ObjectEntriesAsync,
  TObject extends InferEntriesInput<TEntries> | InferEntriesOutput<TEntries>,
> = {
  [TKey in keyof TEntries]: TEntries[TKey] extends
    | QuestionMarkSchema
    | QuestionMarkSchemaAsync
    ? undefined extends TObject[TKey]
      ? TKey
      : never
    : never;
}[keyof TEntries];

/**
 * With question marks type.
 */
type WithQuestionMarks<
  TEntries extends ObjectEntries | ObjectEntriesAsync,
  TObject extends InferEntriesInput<TEntries> | InferEntriesOutput<TEntries>,
> = MarkOptional<TObject, OptionalKeys<TEntries, TObject>>;

/**
 * Readonly keys type.
 */
type ReadonlyKeys<TEntries extends ObjectEntries | ObjectEntriesAsync> = {
  [TKey in keyof TEntries]: TEntries[TKey] extends
    | SchemaWithPipe<
        [
          BaseSchema<unknown, unknown, BaseIssue<unknown>>,
          ...PipeItem<unknown, unknown, BaseIssue<unknown>>[],
        ]
      >
    | SchemaWithPipeAsync<
        [
          (
            | BaseSchema<unknown, unknown, BaseIssue<unknown>>
            | BaseSchemaAsync<unknown, unknown, BaseIssue<unknown>>
          ),
          ...(
            | PipeItem<unknown, unknown, BaseIssue<unknown>>
            | PipeItemAsync<unknown, unknown, BaseIssue<unknown>>
          )[],
        ]
      >
    ? 'readonly' extends TEntries[TKey]['pipe'][number]['type']
      ? TKey
      : never
    : never;
}[keyof TEntries];

/**
 * With readonly type.
 */
type WithReadonly<
  TEntries extends ObjectEntries | ObjectEntriesAsync,
  TObject extends WithQuestionMarks<TEntries, InferEntriesOutput<TEntries>>,
> = Readonly<TObject> &
  Pick<TObject, Exclude<keyof TObject, ReadonlyKeys<TEntries>>>;

/**
 * Infer object input type.
 */
export type InferObjectInput<
  TEntries extends ObjectEntries | ObjectEntriesAsync,
> = Prettify<WithQuestionMarks<TEntries, InferEntriesInput<TEntries>>>;

/**
 * Infer object output type.
 */
export type InferObjectOutput<
  TEntries extends ObjectEntries | ObjectEntriesAsync,
> = Prettify<
  WithReadonly<
    TEntries,
    WithQuestionMarks<TEntries, InferEntriesOutput<TEntries>>
  >
>;

/**
 * Infer object issue type.
 */
export type InferObjectIssue<
  TEntries extends ObjectEntries | ObjectEntriesAsync,
> = InferIssue<TEntries[keyof TEntries]>;
