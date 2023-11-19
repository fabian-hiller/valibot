import { getDefault } from '../../methods/index.ts';
import type { BaseSchema, Input, Output } from '../../types/index.ts';
import { getOutput } from '../../utils/index.ts';

/**
 * Optional schema type.
 */
export interface OptionalSchema<
  TWrapped extends BaseSchema,
  TDefault extends
    | Input<TWrapped>
    | (() => Input<TWrapped> | undefined)
    | undefined = undefined,
  TOutput = TDefault extends Input<TWrapped>
    ? Output<TWrapped>
    : Output<TWrapped> | undefined
> extends BaseSchema<Input<TWrapped> | undefined, TOutput> {
  /**
   * The schema type.
   */
  type: 'optional';
  /**
   * The wrapped schema.
   */
  wrapped: TWrapped;
  /**
   * Returns the default value.
   */
  default: TDefault;
}

/**
 * Creates a optional schema.
 *
 * @param wrapped The wrapped schema.
 *
 * @returns A optional schema.
 */
export function optional<TWrapped extends BaseSchema>(
  wrapped: TWrapped
): OptionalSchema<TWrapped>;

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
  const TDefault extends
    | Input<TWrapped>
    | (() => Input<TWrapped> | undefined)
    | undefined
>(wrapped: TWrapped, default_: TDefault): OptionalSchema<TWrapped, TDefault>;

export function optional<
  TWrapped extends BaseSchema,
  const TDefault extends
    | Input<TWrapped>
    | (() => Input<TWrapped> | undefined)
    | undefined = undefined
>(wrapped: TWrapped, default_?: TDefault): OptionalSchema<TWrapped, TDefault> {
  return {
    type: 'optional',
    async: false,
    wrapped,
    default: default_ as TDefault,
    _parse(input, info) {
      // Allow `undefined` to pass or override it with default value
      if (input === undefined) {
        const override = getDefault(this);
        if (override === undefined) {
          return getOutput(input);
        }
        input = override;
      }

      // Otherwise, return result of wrapped schema
      return this.wrapped._parse(input, info);
    },
  };
}
