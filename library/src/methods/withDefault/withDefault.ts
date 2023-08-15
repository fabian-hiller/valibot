import type { BaseSchema, BaseSchemaAsync, Input } from '../../types.ts';

type GetDefault<TSchema extends BaseSchema | BaseSchemaAsync> = () => Input<TSchema>;

/**
 * Passes a default value to a schema in case of an undefined input.
 *
 * @param schema The affected schema.
 * @param value The default value.
 *
 * @returns The passed schema.
 */
export function withDefault<TSchema extends BaseSchema | BaseSchemaAsync>(
  schema: TSchema,
  value: (() => Input<TSchema>) | Input<TSchema>
): TSchema {
  const getDefault: GetDefault<TSchema> = typeof value === 'function' ? value : () => value;
  
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
      return schema._parse(input === undefined ? getDefault() : input, info);
    },

    _getDefault() {
      return getDefault();
    },
  };
}

/**
 * See {@link withDefault}
 *
 * @deprecated Function has been renamed to `withDefault`.
 */
export const useDefault = withDefault;
