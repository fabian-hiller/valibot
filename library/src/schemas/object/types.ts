import type {
  BaseSchema,
  BaseSchemaAsync,
  Input,
  Output,
  ResolveObject,
} from '../../types/index.ts';
import type { NeverSchema, NeverSchemaAsync } from '../never/index.ts';
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
type RequiredKeys<TObject> = {
  [TKey in keyof TObject]: undefined extends TObject[TKey] ? never : TKey;
}[keyof TObject];

/**
 * Optional object keys type.
 */
type OptionalKeys<TObject> = {
  [TKey in keyof TObject]: undefined extends TObject[TKey] ? TKey : never;
}[keyof TObject];

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
type WithQuestionMarks<TObject> = {
  [K in RequiredKeys<TObject>]: TObject[K];
} & {
  [K in OptionalKeys<TObject>]?: TObject[K];
};

/**
 * Object input inference type.
 */
export type ObjectInput<
  TEntries extends ObjectEntries | ObjectEntriesAsync,
  TRest extends BaseSchema | BaseSchemaAsync | undefined
> = TRest extends undefined | NeverSchema | NeverSchemaAsync
  ? ResolveObject<WithQuestionMarks<EntriesInput<TEntries>>>
  : TRest extends BaseSchema | BaseSchemaAsync
  ? ResolveObject<WithQuestionMarks<EntriesInput<TEntries>>> &
      Record<string, Input<TRest>>
  : never;

/**
 * Object output inference type.
 */
export type ObjectOutput<
  TEntries extends ObjectEntries | ObjectEntriesAsync,
  TRest extends BaseSchema | BaseSchemaAsync | undefined
> = TRest extends undefined | NeverSchema | NeverSchemaAsync
  ? ResolveObject<WithQuestionMarks<EntriesOutput<TEntries>>>
  : TRest extends BaseSchema | BaseSchemaAsync
  ? ResolveObject<WithQuestionMarks<EntriesOutput<TEntries>>> &
      Record<string, Output<TRest>>
  : never;
