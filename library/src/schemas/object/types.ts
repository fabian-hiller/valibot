import type {
  BaseSchema,
  BaseSchemaAsync,
  Input,
  Output,
  ResolveObject,
} from '../../types/index.ts';
import type { NeverSchema, NeverSchemaAsync } from '../never/index.ts';
import type { OptionalSchema, OptionalSchemaAsync } from '../optional/index.ts';
import type { ObjectEntries } from './object.ts';
import type { ObjectEntriesAsync } from './objectAsync.ts';

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
 * Required object keys type.
 */
type RequiredKeys<
  TEntries extends ObjectEntries | ObjectEntriesAsync,
  TObject extends EntriesInput<TEntries> | EntriesOutput<TEntries>,
> = {
  [TKey in keyof TEntries]: TEntries[TKey] extends
    | OptionalSchema<any, any>
    | OptionalSchemaAsync<any, any>
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
    | OptionalSchema<any, any>
    | OptionalSchemaAsync<any, any>
    ? undefined extends TObject[TKey]
      ? TKey
      : never
    : never;
}[keyof TEntries];

/**
 * Entries input inference type.
 */
type EntriesInput<TEntries extends ObjectEntries | ObjectEntriesAsync> = {
  [TKey in keyof TEntries]: Input<TEntries[TKey]>;
};

/**
 * Entries output inference type.
 */
type EntriesOutput<TEntries extends ObjectEntries | ObjectEntriesAsync> = {
  [TKey in keyof TEntries]: Output<TEntries[TKey]>;
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
 * Object input inference type.
 */
export type ObjectInput<
  TEntries extends ObjectEntries | ObjectEntriesAsync,
  TRest extends BaseSchema | BaseSchemaAsync | undefined,
> = TRest extends undefined | NeverSchema | NeverSchemaAsync
  ? ResolveObject<WithQuestionMarks<TEntries, EntriesInput<TEntries>>>
  : TRest extends BaseSchema | BaseSchemaAsync
    ? ResolveObject<WithQuestionMarks<TEntries, EntriesInput<TEntries>>> &
        Record<string, Input<TRest>>
    : never;

/**
 * Object output inference type.
 */
export type ObjectOutput<
  TEntries extends ObjectEntries | ObjectEntriesAsync,
  TRest extends BaseSchema | BaseSchemaAsync | undefined,
> = TRest extends undefined | NeverSchema | NeverSchemaAsync
  ? ResolveObject<WithQuestionMarks<TEntries, EntriesOutput<TEntries>>>
  : TRest extends BaseSchema | BaseSchemaAsync
    ? ResolveObject<WithQuestionMarks<TEntries, EntriesOutput<TEntries>>> &
        Record<string, Output<TRest>>
    : never;
