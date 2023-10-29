import type {
  BaseSchema,
  BaseSchemaAsync,
  Input,
  Output,
  ResolveObject,
} from '../../types.ts';
import type { ObjectEntries } from './object.ts';
import type { ObjectEntriesAsync } from './objectAsync.ts';

/**
 * Object path item type.
 */
export type ObjectPathItem = {
  schema: 'object';
  input: Record<string, any>;
  key: string;
  value: any;
};

/**
 * Required object keys type.
 */
type RequiredKeys<TObject extends object> = {
  [TKey in keyof TObject]: undefined extends TObject[TKey] ? never : TKey;
}[keyof TObject];

/**
 * Optional object keys type.
 */
type OptionalKeys<TObject extends object> = {
  [TKey in keyof TObject]: undefined extends TObject[TKey] ? TKey : never;
}[keyof TObject];

/**
 * Object with question marks type.
 */
type WithQuestionMarks<TObject extends object> = Pick<
  TObject,
  RequiredKeys<TObject>
> &
  Partial<Pick<TObject, OptionalKeys<TObject>>>;

/**
 * Object input inference type.
 */
export type ObjectInput<
  TObjectEntries extends ObjectEntries | ObjectEntriesAsync,
  TObjectRest extends BaseSchema | BaseSchemaAsync | undefined
> = TObjectRest extends BaseSchema | BaseSchemaAsync
  ? ResolveObject<
      WithQuestionMarks<{
        [TKey in keyof TObjectEntries]: Input<TObjectEntries[TKey]>;
      }>
    > &
      Record<string, Input<TObjectRest>>
  : ResolveObject<
      WithQuestionMarks<{
        [TKey in keyof TObjectEntries]: Input<TObjectEntries[TKey]>;
      }>
    >;

/**
 * Object output inference type.
 */
export type ObjectOutput<
  TObjectEntries extends ObjectEntries | ObjectEntriesAsync,
  TObjectRest extends BaseSchema | BaseSchemaAsync | undefined
> = TObjectRest extends BaseSchema | BaseSchemaAsync
  ? ResolveObject<
      WithQuestionMarks<{
        [TKey in keyof TObjectEntries]: Output<TObjectEntries[TKey]>;
      }>
    > &
      Record<string, Output<TObjectRest>>
  : ResolveObject<
      WithQuestionMarks<{
        [TKey in keyof TObjectEntries]: Output<TObjectEntries[TKey]>;
      }>
    >;
