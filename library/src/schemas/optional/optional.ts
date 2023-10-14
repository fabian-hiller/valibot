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
  kind: 'optional';
  /**
   * The wrapped schema.
   */
  wrapped: TWrapped;
  /**
   * The default value.
   */
  get default(): TDefault;
};

/**
 * Creates a optional schema.
 *
 * @param wrapped The wrapped schema.
 * @param default_ The default value.
 *
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
    kind: 'optional',
    async: false,
    wrapped,
    get default() {
      return typeof default_ === 'function'
        ? (default_ as () => TDefault)()
        : (default_ as TDefault);
    },
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
