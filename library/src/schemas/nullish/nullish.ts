import { getDefault } from '../../methods/index.ts';
import type { BaseSchema, Default, Input, Output } from '../../types/index.ts';
import { schemaResult } from '../../utils/index.ts';

/**
 * Nullish schema type.
 */
export interface NullishSchema<
  TWrapped extends BaseSchema,
  TDefault extends Default<TWrapped> = undefined,
  TOutput = TDefault extends Input<TWrapped> | (() => Input<TWrapped>)
    ? Output<TWrapped>
    : Output<TWrapped> | null | undefined,
> extends BaseSchema<Input<TWrapped> | null | undefined, TOutput> {
  /**
   * The schema type.
   */
  type: 'nullish';
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
 * Creates a nullish schema.
 *
 * @param wrapped The wrapped schema.
 *
 * @returns A nullish schema.
 */
export function nullish<TWrapped extends BaseSchema>(
  wrapped: TWrapped
): NullishSchema<TWrapped>;

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
  TDefault extends Default<TWrapped>,
>(wrapped: TWrapped, default_: TDefault): NullishSchema<TWrapped, TDefault>;

export function nullish<
  TWrapped extends BaseSchema,
  TDefault extends Default<TWrapped> = undefined,
>(wrapped: TWrapped, default_?: TDefault): NullishSchema<TWrapped, TDefault> {
  return {
    type: 'nullish',
    expects: `${wrapped.expects} | null | undefined`,
    async: false,
    wrapped,
    default: default_ as TDefault,
    _parse(input, config) {
      // If input is `null` or `undefined`, return typed schema result or
      // override it with default value
      if (input === null || input === undefined) {
        const override = getDefault(this);
        if (override === undefined) {
          return schemaResult(true, input);
        }
        input = override;
      }

      // Otherwise, return result of wrapped schema
      return this.wrapped._parse(input, config);
    },
  };
}
