import type { ObjectSchema } from '../../schemas/index.ts';
import type { ObjectEntries } from '../../types/index.ts';

type Merge<A extends object, B extends object> = Omit<A, keyof B> & B

type Flatten<T> = { [K in keyof T]: T[K] };

type MergedEntries<TSchemas extends ObjectSchema<ObjectEntries, undefined>[]> = Flatten<
  TSchemas extends [infer First, ...infer Rest]
    ? First extends ObjectSchema<infer FirstEntries, undefined>
      ? Rest extends ObjectSchema<ObjectEntries, undefined>[]
        ? Merge<FirstEntries, MergedEntries<Rest>>
        : FirstEntries
      : unknown
    : object
>;

/**
 * Creates a new object entries definition from existing object schemas.
 *
 * @param schemas The schemas to merge.
 *
 * @returns The object entries.
 */
// @__NO_SIDE_EFFECTS__
export function entriesFromObjects<
  TSchemas extends ObjectSchema<ObjectEntries, undefined>[]
>(
  ...schemas: TSchemas
): MergedEntries<TSchemas> {
  return schemas.reduce((acc, schema) => {
    return { ...acc, ...schema.entries };
  }, {} as MergedEntries<TSchemas>);
}
