import type { BaseSchema, Input, Output } from '../../types.ts';
import { getOutput } from '../../utils/index.ts';

/**
 * Nullish schema type.
 */
export type NullishSchema<
  TSchema extends BaseSchema,
  TDefault extends Input<TSchema> | undefined = undefined,
  TOutput = TDefault extends Input<TSchema>
    ? Output<TSchema>
    : Output<TSchema> | null | undefined
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
  TDefault extends Input<TSchema> | undefined = undefined
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
      // Allow `null` or `undefined` to pass or override it with default value
      if (input === null || input === undefined) {
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
