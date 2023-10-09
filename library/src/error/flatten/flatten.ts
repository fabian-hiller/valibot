import type {
  ArraySchema,
  ArraySchemaAsync,
  MapSchema,
  MapSchemaAsync,
  ObjectSchema,
  ObjectSchemaAsync,
  ObjectShape,
  ObjectShapeAsync,
  RecordSchema,
  RecordSchemaAsync,
  RecursiveSchema,
  RecursiveSchemaAsync,
  SetSchema,
  SetSchemaAsync,
  TupleSchema,
  TupleSchemaAsync,
  TupleShape,
  TupleShapeAsync,
  UnionOptions,
  UnionOptionsAsync,
  UnionSchema,
  UnionSchemaAsync,
} from '../../schemas/index.ts';
import type {
  BaseSchema,
  BaseSchemaAsync,
  Input,
  Issues,
} from '../../types.ts';
import type { ValiError } from '../ValiError/index.ts';

/**
 * Dot path type.
 */
type DotPath<TKey, TSchema extends BaseSchema | BaseSchemaAsync> = TKey extends
  | string
  | number
  ? `${TKey}` | `${TKey}.${NestedPath<TSchema>}`
  : never;

/**
 * Object path type.
 */
type ObjectPath<TObjectShape extends ObjectShape | ObjectShapeAsync> = {
  [TKey in keyof TObjectShape]: DotPath<TKey, TObjectShape[TKey]>;
}[keyof TObjectShape];

/**
 * Tuple key type.
 */
type TupleKey<T extends any[]> = Exclude<keyof T, keyof any[]>;

/**
 * Tuple path type.
 */
type TuplePath<TTupleShape extends TupleShape | TupleShapeAsync> = {
  [TKey in TupleKey<TTupleShape>]: DotPath<TKey, TTupleShape[TKey & number]>;
}[TupleKey<TTupleShape>];

/**
 * Nested path type.
 */
type NestedPath<TSchema extends BaseSchema | BaseSchemaAsync> =
  // Array
  TSchema extends ArraySchema<infer TArrayItem extends BaseSchema>
    ? DotPath<number, TArrayItem>
    : TSchema extends ArraySchemaAsync<
        infer TArrayItem extends BaseSchema | BaseSchemaAsync
      >
    ? DotPath<number, TArrayItem>
    : // Map
    TSchema extends
        | MapSchema<infer TMapKey, infer TMapValue>
        | MapSchemaAsync<infer TMapKey, infer TMapValue>
    ? DotPath<Input<TMapKey>, TMapValue>
    : // Object
    TSchema extends ObjectSchema<infer TObjectShape extends ObjectShape>
    ? ObjectPath<TObjectShape>
    : TSchema extends ObjectSchemaAsync<
        infer TObjectShape extends ObjectShapeAsync
      >
    ? ObjectPath<TObjectShape>
    : // Record
    TSchema extends
        | RecordSchema<infer TRecordKey, infer TRecordValue>
        | RecordSchemaAsync<infer TRecordKey, infer TRecordValue>
    ? DotPath<Input<TRecordKey>, TRecordValue>
    : // Recursive
    TSchema extends RecursiveSchema<
        infer TSchemaGetter extends () => BaseSchema
      >
    ? NestedPath<ReturnType<TSchemaGetter>>
    : TSchema extends RecursiveSchemaAsync<
        infer TSchemaGetter extends () => BaseSchema | BaseSchemaAsync
      >
    ? NestedPath<ReturnType<TSchemaGetter>>
    : // Set
    TSchema extends SetSchema<infer TSetValue> | SetSchemaAsync<infer TSetValue>
    ? DotPath<number, TSetValue>
    : // Tuple
    TSchema extends
        | TupleSchema<infer TTupleShape, infer TTupleRest>
        | TupleSchemaAsync<infer TTupleShape, infer TTupleRest>
    ? TTupleRest extends BaseSchema
      ? TuplePath<TTupleShape> | DotPath<number, TTupleRest>
      : TuplePath<TTupleShape>
    : // Union
    TSchema extends UnionSchema<infer TUnionOptions extends UnionOptions>
    ? NestedPath<TUnionOptions[number]>
    : TSchema extends UnionSchemaAsync<
        infer TUnionOptions extends UnionOptionsAsync
      >
    ? NestedPath<TUnionOptions[number]>
    : // Otherwise
      never;

/**
 * Flat errors type.
 */
export type FlatErrors<TSchema extends BaseSchema | BaseSchemaAsync = any> = {
  root?: [string, ...string[]];
  nested: Partial<Record<NestedPath<TSchema>, [string, ...string[]]>>;
};

/**
 * Flatten the error messages of a Vali error.
 *
 * @param error A Vali error.
 *
 * @returns Flat errors.
 */
export function flatten<TSchema extends BaseSchema | BaseSchemaAsync = any>(
  error: ValiError
): FlatErrors<TSchema>;

/**
 * Flatten the error messages of issues.
 *
 * @param issues The issues.
 *
 * @returns Flat errors.
 */
export function flatten<TSchema extends BaseSchema | BaseSchemaAsync = any>(
  issues: Issues
): FlatErrors<TSchema>;

/**
 *
 * @param arg1 A Vali error or issues.
 *
 * @returns Flat errors.
 */
export function flatten<TSchema extends BaseSchema | BaseSchemaAsync = any>(
  arg1: ValiError | Issues
): FlatErrors<TSchema> {
  return (Array.isArray(arg1) ? arg1 : arg1.issues).reduce<FlatErrors<TSchema>>(
    (flatErrors, issue) => {
      if (issue.path) {
        if (
          issue.path.every(
            ({ key }) => typeof key === 'string' || typeof key === 'number'
          )
        ) {
          const path = issue.path.map(({ key }) => key).join('.') as NestedPath<
            Input<TSchema>
          >;
          if (flatErrors.nested[path]) {
            flatErrors.nested[path]!.push(issue.message);
          } else {
            flatErrors.nested[path] = [issue.message];
          }
        }
      } else {
        if (flatErrors.root) {
          flatErrors.root.push(issue.message);
        } else {
          flatErrors.root = [issue.message];
        }
      }
      return flatErrors;
    },
    { nested: {} }
  );
}
