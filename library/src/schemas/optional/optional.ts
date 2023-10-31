import type { BaseSchema, Input, Output } from '../../types.ts';
import { getOutput } from '../../utils/index.ts';

/**
 * Optional schema type.
 */
export type OptionalSchema<
  TWrapped extends BaseSchema,
  TDefault extends Input<TWrapped> | undefined = undefined,
  TOutput = TDefault extends Input<TWrapped>
    ? Output<TWrapped>
    : Output<TWrapped> | undefined
> = BaseSchema<Input<TWrapped> | undefined, TOutput> & {
  type: 'optional';
  /**
   * The wrapped schema.
   */
  wrapped: TWrapped;
  /**
   * Returns the default value.
   */
  getDefault: () => TDefault;
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
    type: 'optional',
    async: false,
    wrapped,
    getDefault() {
      return typeof default_ === 'function'
        ? (default_ as () => TDefault)()
        : (default_ as TDefault);
    },
    _parse(input, info) {
      // Allow `undefined` to pass or override it with default value
      if (input === undefined) {
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
