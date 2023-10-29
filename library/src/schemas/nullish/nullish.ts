import type { BaseSchema, Input, Output } from '../../types.ts';
import { getOutput } from '../../utils/index.ts';

/**
 * Nullish schema type.
 */
export type NullishSchema<
  TSchema extends BaseSchema,
  TDefault extends Input<TSchema> | null | undefined = undefined,
  TOutput = TDefault extends undefined | null
    ? Output<TSchema> | null | undefined
    : Output<TSchema>
> = BaseSchema<Input<TSchema> | null | undefined, TOutput> & {
  schema: 'nullish';
  wrapped: TSchema;
  getDefault: () => TDefault;
};

/**
 * Creates a nullish schema.
 *
 * @param schema The wrapped schema.
 * @param value The default value.
 *
 * @returns A nullish schema.
 */
export function nullish<
  TSchema extends BaseSchema,
  TDefault extends Input<TSchema> | null | undefined = undefined
>(
  schema: TSchema,
  value?: TDefault | (() => TDefault)
): NullishSchema<TSchema, TDefault> {
  return {
    /**
     * The schema type.
     */
    schema: 'nullish',

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
      // Get default or input value
      let default_: TDefault;
      const value =
        (input === null || input === undefined) &&
        (default_ = this.getDefault()) &&
        default_ !== undefined
          ? default_
          : input;

      // Allow `null` or `undefined` value to pass
      if (value === null || value === undefined) {
        return getOutput(value);
      }

      // Return result of wrapped schema
      return schema._parse(value, info);
    },
  };
}
