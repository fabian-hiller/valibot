import type { BaseSchemaAsync } from '../../types/index.ts';

/**
 * Coerces the input of a async schema to match the required type.
 *
 * @param schema The affected schema.
 * @param action The coerceation action.
 *
 * @returns The passed schema.
 */
export function coerceAsync<TSchema extends BaseSchemaAsync>(
  schema: TSchema,
  action: (input: unknown) => unknown
): TSchema {
  return {
    ...schema,
    async _parse(input, info) {
      return schema._parse(await action(input), info);
    },
  };
}
