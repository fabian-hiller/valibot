import type { BaseSchema, Input, Output } from '../../types.ts';
import { getOutput } from '../../utils/index.ts';

/**
 * Nullable schema type.
 */
export type NullableSchema<
  TWrapped extends BaseSchema,
  TDefault extends Input<TWrapped> | undefined = undefined,
  TOutput = TDefault extends undefined
    ? Output<TWrapped> | null
    : Output<TWrapped>
> = BaseSchema<Input<TWrapped> | null, TOutput> & {
  schema: 'nullable';
  wrapped: TWrapped;
  get default(): TDefault;
};

/**
 * Creates a nullable schema.
 * @param wrapped The wrapped schema.
 * @param default_ The default value.
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
    schema: 'nullable',

    /**
     * The wrapped schema.
     */
    wrapped,

    /**
     * The default value.
     * @returns The default value.
     */
    get default() {
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
     * @param input The input to be parsed.
     * @param info The parse info.
     * @returns The parsed output.
     */
    _parse(input, info) {
      // Get default or input value
      let default_: TDefault;
      const value =
        input === null && (default_ = this.default) && default_ !== undefined
          ? default_
          : input;

      // Allow `null` value to pass
      if (value === null) {
        return getOutput(value);
      }

      // Return result of wrapped schema
      return wrapped._parse(value, info);
    },
  };
}
