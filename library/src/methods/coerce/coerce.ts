import type { BaseSchema } from '../../types/index.ts';

/**
 * Coerces the input of a schema to match the required type.
 *
 * @param schema The affected schema.
 * @param action The coerceation action.
 *
 * @returns The passed schema.
 */
export function coerce<TSchema extends BaseSchema>(
  schema: TSchema,
  action: (value: unknown) => unknown
): TSchema {
  return {
    ...schema,
    _parse(input, info) {
      return schema._parse(action(input), info);
    },
  };
}
