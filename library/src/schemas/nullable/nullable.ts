import type { BaseSchema, Input, Output } from '../../types.ts';
import { getOutput } from '../../utils/index.ts';

/**
 * Nullable schema type.
 */
export type NullableSchema<
  TWrapped extends BaseSchema,
  TDefault extends Input<TWrapped> | undefined = undefined,
  TOutput = TDefault extends Input<TWrapped>
    ? Output<TWrapped>
    : Output<TWrapped> | null
> = BaseSchema<Input<TWrapped> | null, TOutput> & {
  type: 'nullable';
  wrapped: TWrapped;
  getDefault: () => TDefault;
};

/**
 * Creates a nullable schema.
 *
 * @param wrapped The wrapped schema.
 * @param default_ The default value.
 *
 * @returns A nullable schema.
 */
export function nullable<
  TWrapped extends BaseSchema,
  TDefault extends Input<TWrapped> | undefined = undefined
>(
  wrapped: TWrapped,
  default_?: TDefault | (() => TDefault)
): NullableSchema<TWrapped, TDefault> {
  return {
    /**
     * The schema type.
     */
    type: 'nullable',

    /**
     * The wrapped schema.
     */
    wrapped,

    /**
     * Returns the default value.
     */
    getDefault() {
      return typeof default_ === 'function'
        ? (default_ as () => TDefault)()
        : (default_ as TDefault);
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
      return wrapped._parse(input, info);
    },
  };
}
