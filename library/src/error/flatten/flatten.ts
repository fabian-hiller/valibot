import type {
  ObjectEntries,
  ObjectEntriesAsync,
  TupleItems,
  TupleItemsAsync,
  UnionOptions,
  UnionOptionsAsync,
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
type DotPath<TKey, TSchema> = TKey extends string | number
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
  [TKey in TupleKey<TItems>]: DotPath<TKey, TItems[TKey]>;
}[TupleKey<TItems>];

/**
 * Nested path type.
 */
type NestedPath<TSchema> =
  // Array
  TSchema extends { item: infer TItem extends BaseSchema | BaseSchemaAsync }
    ? DotPath<number, TItem>
    : // Map or Record
      TSchema extends {
          key: infer TKey extends BaseSchema | BaseSchemaAsync;
          value: infer TValue extends BaseSchema | BaseSchemaAsync;
        }
      ? DotPath<Input<TKey>, TValue>
      : // Object
        TSchema extends {
            entries: infer TEntries extends ObjectEntries | ObjectEntriesAsync;
            rest: infer TRest extends BaseSchema | BaseSchemaAsync | undefined;
          }
        ? TRest extends undefined
          ? ObjectPath<TEntries>
          : string
        : // Recursive
          TSchema extends {
              getter: infer TSchemaGetter extends () =>
                | BaseSchema
                | BaseSchemaAsync;
            }
          ? NestedPath<ReturnType<TSchemaGetter>>
          : // Set
            TSchema extends {
                value: infer TValue extends BaseSchema | BaseSchemaAsync;
              }
            ? DotPath<number, TValue>
            : // Tuple
              TSchema extends {
                  items: infer TItems extends TupleItems | TupleItemsAsync;
                  rest: infer TRest extends
                    | BaseSchema
                    | BaseSchemaAsync
                    | undefined;
                }
              ? TRest extends undefined
                ? TuplePath<TItems>
                : TuplePath<TItems> | DotPath<number, TRest>
              : // Union
                TSchema extends {
                    options: infer TUnionOptions extends
                      | UnionOptions
                      | UnionOptionsAsync;
                  }
                ? NestedPath<TUnionOptions[number]>
                : // Otherwise
                  never;

/**
 * Flat errors type.
 */
export interface FlatErrors<
  TSchema extends BaseSchema | BaseSchemaAsync = any,
> {
  root?: [string, ...string[]];
  nested: { [K in NestedPath<TSchema>]?: [string, ...string[]] };
}

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
