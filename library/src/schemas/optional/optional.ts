import type { BaseSchema, Input, Output } from '../../types.ts';
import { getOutput } from '../../utils/index.ts';

/**
 * Optional schema type.
 */
export type OptionalSchema<
  TWrapped extends BaseSchema,
  TDefault extends Input<TWrapped> | undefined = undefined,
  TOutput = TDefault extends undefined
    ? Output<TWrapped> | undefined
    : Output<TWrapped>
> = BaseSchema<Input<TWrapped> | undefined, TOutput> & {
  schema: 'optional';
  wrapped: TWrapped;
  get default(): TDefault;
};

/**
 * Creates a optional schema.
 * @param wrapped The wrapped schema.
 * @param default_ The default value.
 * @returns A optional schema.
 */
export function optional<
  TWrapped extends BaseSchema,
  TDefault extends Input<TWrapped> | undefined = undefined
>(
  wrapped: TWrapped,
  default_?: TDefault | (() => TDefault)
): OptionalSchema<TWrapped, TDefault> {
  return {
    /**
     * The schema type.
     */
    schema: 'optional',

    /**
     * The wrapped schema.
     */
    wrapped,

    /**
     * The default value.
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
      const value = input === undefined ? this.default : input;

      // Allow `undefined` value to pass
      if (value === undefined) {
        return getOutput(value);
      }

      // Return result of wrapped schema
      return wrapped._parse(value, info);
    },
  };
}
