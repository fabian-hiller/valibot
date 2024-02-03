import type {
  ArraySchema,
  ArraySchemaAsync,
  MapSchema,
  MapSchemaAsync,
  ObjectEntries,
  ObjectEntriesAsync,
  ObjectSchema,
  ObjectSchemaAsync,
  RecordSchema,
  RecordSchemaAsync,
  RecursiveSchema,
  RecursiveSchemaAsync,
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
  Issue,
  Issues,
  PathItem,
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
type TupleKey<T extends unknown[]> = Exclude<keyof T, keyof unknown[]>;

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
    ? TRest extends BaseSchema | BaseSchemaAsync
      ? ObjectPath<TEntries> | DotPath<string, TRest>
      : ObjectPath<TEntries>
    : // Record
    TSchema extends
        | RecordSchema<infer TKey, infer TValue>
        | RecordSchemaAsync<infer TKey, infer TValue>
    ? DotPath<Input<TKey>, TValue>
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
    TSchema extends SetSchema<infer TValue> | SetSchemaAsync<infer TValue>
    ? DotPath<number, TValue>
    : // Tuple
    TSchema extends
        | TupleSchema<infer TItems, infer TRest>
        | TupleSchemaAsync<infer TItems, infer TRest>
    ? TRest extends BaseSchema | BaseSchemaAsync
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
export type FlatErrors<TSchema extends BaseSchema | BaseSchemaAsync> = {
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
export function flatten<TSchema extends BaseSchema | BaseSchemaAsync>(
  error: ValiError
): FlatErrors<TSchema>;

/**
 * Flatten the error messages of issues.
 *
 * @param issues The issues.
 *
 * @returns Flat errors.
 */
export function flatten<TSchema extends BaseSchema | BaseSchemaAsync>(
  issues: Issues
): FlatErrors<TSchema>;

export function flatten<TSchema extends BaseSchema | BaseSchemaAsync>(
  arg1: ValiError | Issues
): FlatErrors<TSchema> {
  const issues = Array.isArray(arg1) ? arg1 : arg1.issues;
  return issues.reduce<FlatErrors<TSchema>>(processIssue, { nested: {} });
}

function processIssue<TSchema extends BaseSchema | BaseSchemaAsync>(
  flatErrors: FlatErrors<TSchema>,
  issue: Issue
): FlatErrors<TSchema> {
  if (issue.path && isPathValid(issue.path)) {
    const path = formatPath(issue.path);
    updateNestedErrors(flatErrors, path, issue.message);
  } else {
    updateRootErrors(flatErrors, issue.message);
  }
  return flatErrors;
}

function isPathValid(path: PathItem[]): boolean {
  return path.every(
    ({ key }) => typeof key === 'string' || typeof key === 'number'
  );
}

function formatPath<TSchema extends BaseSchema | BaseSchemaAsync>(
  path: PathItem[]
): NestedPath<TSchema> {
  return path.map(({ key }) => key).join('.') as NestedPath<Input<TSchema>>;
}

function updateNestedErrors<TSchema extends BaseSchema | BaseSchemaAsync>(
  flatErrors: FlatErrors<TSchema>,
  path: keyof Record<NestedPath<TSchema>, [string, ...string[]]>,
  message: string
): void {
  if (flatErrors.nested[path]) {
    flatErrors.nested[path]!.push(message);
  } else {
    flatErrors.nested[path] = [message];
  }
}

function updateRootErrors<TSchema extends BaseSchema | BaseSchemaAsync>(
  flatErrors: FlatErrors<TSchema>,
  message: string
): void {
  if (flatErrors.root) {
    flatErrors.root.push(message);
  } else {
    flatErrors.root = [message];
  }
}
