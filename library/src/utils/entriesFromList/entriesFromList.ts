import type { BaseIssue, BaseSchema } from '../../types/index.ts';

/**
 * Creates a object entries definition from a list of keys and a schema.
 *
 * @param list A list of keys.
 * @param schema The schema of the keys.
 *
 * @returns The object entries.
 */
export function entriesFromList<
  const TList extends readonly string[],
  const TSchema extends BaseSchema<unknown, unknown, BaseIssue<unknown>>,
>(list: TList, schema: TSchema): Record<TList[number], TSchema> {
  // @ts-expect-error
  const entries: Record<TList[number], TSchema> = {};
  for (const key of list) {
    entries[key as TList[number]] = schema;
  }
  return entries;
}
