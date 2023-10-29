import type { BaseSchema, Input, Output } from '../../types.ts';
import { getOutput } from '../../utils/index.ts';

/**
 * Nullable schema type.
 */
export type NullableSchema<
  TSchema extends BaseSchema,
  TDefault extends Input<TSchema> | undefined = undefined,
  TOutput = TDefault extends Input<TSchema>
    ? Output<TSchema>
    : Output<TSchema> | null
> = BaseSchema<Input<TSchema> | null, TOutput> & {
  schema: 'nullable';
  wrapped: TSchema;
  getDefault: () => TDefault;
};

/**
 * Creates a nullable schema.
 *
 * @param schema The wrapped schema.
 * @param value The default value.
 *
 * @returns A nullable schema.
 */
export function nullable<
  TSchema extends BaseSchema,
  TDefault extends Input<TSchema> | undefined = undefined
>(
  schema: TSchema,
  value?: TDefault | (() => TDefault)
): NullableSchema<TSchema, TDefault> {
  return {
    /**
     * The schema type.
     */
    schema: 'nullable',

    /**
     * The wrapped schema.
     */
    wrapped: schema,

    /**
     * Returns the default value.
     */
    getDefault() {
      return typeof value === 'function'
        ? (value as () => TDefault)()
        : (value as TDefault);
    },

    /**
     * Whether it's async.
     */
    async: false,

    /**
     * Parses unknown input based on its schema.
     *
     * @param input The input to be parsed.
     * @param info The parse info.
     *
     * @returns The parsed output.
     */
    _parse(input, info) {
      // Allow `null` to pass or override it with default value
      if (input === null) {
        const override = this.getDefault();
        if (override === undefined) {
          return getOutput(input);
        }
        input = override;
      }

      // Otherwise, return result of wrapped schema
      return schema._parse(input, info);
    },
  };
}
