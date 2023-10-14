import type { BaseSchema, Input, Output } from '../../types.ts';
import { getOutput } from '../../utils/index.ts';

/**
 * Nullish schema type.
 */
export type NullishSchema<
  TWrapped extends BaseSchema,
  TDefault extends Input<TWrapped> | undefined = undefined,
  TOutput = TDefault extends undefined
    ? Output<TWrapped> | null | undefined
    : Output<TWrapped>
> = BaseSchema<Input<TWrapped> | null | undefined, TOutput> & {
  kind: 'nullish';
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
 * Creates a nullish schema.
 *
 * @param wrapped The wrapped schema.
 * @param default_ The default value.
 *
 * @returns A nullish schema.
 */
export function nullish<
  TWrapped extends BaseSchema,
  TDefault extends Input<TWrapped> | undefined = undefined
>(
  wrapped: TWrapped,
  default_?: TDefault | (() => TDefault)
): NullishSchema<TWrapped, TDefault> {
  return {
    kind: 'nullish',
    async: false,
    wrapped,
    get default() {
      return typeof default_ === 'function'
        ? (default_ as () => TDefault)()
        : (default_ as TDefault);
    },
    _parse(input, info) {
      // Get default or input value
      let default_: TDefault;
      const value =
        (input === null || input === undefined) &&
        (default_ = this.default) &&
        default_ !== undefined
          ? default_
          : input;

      // Allow `null` or `undefined` value to pass
      if (value === null || value === undefined) {
        return getOutput(value);
      }

      // Return result of wrapped schema
      return wrapped._parse(value, info);
    },
  };
}
