import type { BaseSchema, Input, Output } from '../../types.ts';
import { getOutput } from '../../utils/index.ts';

/**
 * Nullish schema type.
 */
export type NullishSchema<
  TWrapped extends BaseSchema,
  TDefault extends Input<TWrapped> | undefined = undefined,
  TOutput = TDefault extends Input<TWrapped>
    ? Output<TWrapped>
    : Output<TWrapped> | null | undefined
> = BaseSchema<Input<TWrapped> | null | undefined, TOutput> & {
  type: 'nullish';
  wrapped: TWrapped;
  /**
   * Returns the default value.
   */
  getDefault: () => TDefault;
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
    type: 'nullish',
    async: false,
    wrapped,
    getDefault() {
      return typeof default_ === 'function'
        ? (default_ as () => TDefault)()
        : (default_ as TDefault);
    },
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
      return wrapped._parse(input, info);
    },
  };
}
