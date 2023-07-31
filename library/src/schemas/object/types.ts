import type { Input, Output, ResolveObject } from '../../types.ts';
import type { ObjectShape } from './object.ts';
import type { ObjectShapeAsync } from './objectAsync.ts';

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
export type ObjectInput<TObjectShape extends ObjectShape | ObjectShapeAsync> =
  ResolveObject<
    WithQuestionMarks<{
      [TKey in keyof TObjectShape]: Input<TObjectShape[TKey]>;
    }>
  >;

/**
 * Object output inference type.
 */
export type ObjectOutput<TObjectShape extends ObjectShape | ObjectShapeAsync> =
  ResolveObject<
    WithQuestionMarks<{
      [TKey in keyof TObjectShape]: Output<TObjectShape[TKey]>;
    }>
  >;
