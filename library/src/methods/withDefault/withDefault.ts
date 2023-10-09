import type { BaseSchema, BaseSchemaAsync, Input } from '../../types.ts';

/**
 * Passes a default value to a schema in case of an undefined input.
 *
 * @param schema The affected schema.
 * @param value The default value.
 *
 * @returns The passed schema.
 *
 * @deprecated Use `optional` instead.
 */
export function withDefault<TSchema extends BaseSchema | BaseSchemaAsync>(
  schema: TSchema,
  value: Input<TSchema> | (() => Input<TSchema>)
): TSchema {
  return {
    ...schema,

    /**
     * Parses unknown input based on its schema.
     *
     * @param input The input to be parsed.
     * @param info The parse info.
     *
     * @returns The parsed output.
     */
    _parse(input, info) {
      return schema._parse(
        input === undefined
          ? typeof value === 'function'
            ? (value as () => Input<TSchema>)()
            : value
          : input,
        info
      );
    },
  };
}

/**
 * See {@link withDefault}
 *
 * @deprecated Use `optional` instead.
 */
export const useDefault = withDefault;
