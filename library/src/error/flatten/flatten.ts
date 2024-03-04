import type {
  ArraySchema,
  ArraySchemaAsync,
  LazySchema,
  LazySchemaAsync,
  MapSchema,
  MapSchemaAsync,
  ObjectEntries,
  ObjectEntriesAsync,
  ObjectSchema,
  ObjectSchemaAsync,
  RecordSchema,
  RecordSchemaAsync,
  SetSchema,
  SetSchemaAsync,
  TupleItems,
  TupleItemsAsync,
  TupleSchema,
  TupleSchemaAsync,
  UnionOptions,
  UnionOptionsAsync,
  UnionSchema,
  UnionSchemaAsync,
} from '../../schemas/index.ts';
import type {
  BaseSchema,
  BaseSchemaAsync,
  Input,
  SchemaIssues,
} from '../../types/index.ts';
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
type ObjectPath<TEntries extends ObjectEntries | ObjectEntriesAsync> = {
  [TKey in keyof TEntries]: DotPath<TKey, TEntries[TKey]>;
}[keyof TEntries];

/**
 * Tuple key type.
 */
type TupleKey<T extends any[]> = Exclude<keyof T, keyof any[]>;

/**
 * Tuple path type.
 */
type TuplePath<TItems extends TupleItems | TupleItemsAsync> = {
  [TKey in TupleKey<TItems>]: DotPath<TKey, TItems[TKey & number]>;
}[TupleKey<TItems>];

/**
 * Nested path type.
 */
type NestedPath<TSchema extends BaseSchema | BaseSchemaAsync> =
  // Array
  TSchema extends ArraySchema<infer TItem extends BaseSchema>
    ? DotPath<number, TItem>
    : TSchema extends ArraySchemaAsync<
        infer TItem extends BaseSchema | BaseSchemaAsync
      >
    ? DotPath<number, TItem>
    : // Map
    TSchema extends
        | MapSchema<infer TKey, infer TValue>
        | MapSchemaAsync<infer TKey, infer TValue>
    ? DotPath<Input<TKey>, TValue>
    : // Object
    TSchema extends
        | ObjectSchema<infer TEntries, infer TRest>
        | ObjectSchemaAsync<infer TEntries, infer TRest>
    ? TRest extends NonNullable<TRest>
      ? ObjectPath<TEntries> | DotPath<string, TRest>
      : ObjectPath<TEntries>
    : // Record
    TSchema extends
        | RecordSchema<infer TKey, infer TValue>
        | RecordSchemaAsync<infer TKey, infer TValue>
    ? DotPath<Input<TKey>, TValue>
    : // Lazy
    TSchema extends LazySchema<infer TSchemaGetter extends () => BaseSchema>
    ? NestedPath<ReturnType<TSchemaGetter>>
    : TSchema extends LazySchemaAsync<
        infer TSchemaGetter extends () => BaseSchema | BaseSchemaAsync
      >
    ? NestedPath<ReturnType<TSchemaGetter>>
    : // Set
    TSchema extends SetSchema<infer TValue> | SetSchemaAsync<infer TValue>
    ? DotPath<number, TValue>
    : // Tuple
    TSchema extends
        | TupleSchema<infer TItems, infer TRest>
        | TupleSchemaAsync<infer TItems, infer TRest>
    ? TRest extends NonNullable<TRest>
      ? TuplePath<TItems> | DotPath<number, TRest>
      : TuplePath<TItems>
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
  issues: SchemaIssues
): FlatErrors<TSchema>;

export function flatten<TSchema extends BaseSchema | BaseSchemaAsync = any>(
  arg1: ValiError | SchemaIssues
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
