import { getDefault } from '../../methods/index.ts';
import type { BaseSchema, Input, Output } from '../../types/index.ts';
import { schemaResult } from '../../utils/index.ts';

/**
 * Nullable schema type.
 */
export interface NullableSchema<
  TWrapped extends BaseSchema,
  TDefault extends
    | Input<TWrapped>
    | (() => Input<TWrapped> | undefined)
    | undefined = undefined,
  TOutput = TDefault extends Input<TWrapped> | (() => Input<TWrapped>)
    ? Output<TWrapped>
    : Output<TWrapped> | null
> extends BaseSchema<Input<TWrapped> | null, TOutput> {
  /**
   * The schema type.
   */
  type: 'nullable';
  /**
   * The wrapped schema.
   */
  wrapped: TWrapped;
  /**
   * The default value.
   */
  default: TDefault;
}

/**
 * Creates a nullable schema.
 *
 * @param wrapped The wrapped schema.
 *
 * @returns A nullable schema.
 */
export function nullable<TWrapped extends BaseSchema>(
  wrapped: TWrapped
): NullableSchema<TWrapped>;

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
  TDefault extends
    | Input<TWrapped>
    | (() => Input<TWrapped> | undefined)
    | undefined
>(wrapped: TWrapped, default_: TDefault): NullableSchema<TWrapped, TDefault>;

export function nullable<
  TWrapped extends BaseSchema,
  TDefault extends
    | Input<TWrapped>
    | (() => Input<TWrapped> | undefined)
    | undefined = undefined
>(wrapped: TWrapped, default_?: TDefault): NullableSchema<TWrapped, TDefault> {
  return {
    type: 'nullable',
    expects: `${wrapped.expects} | null`,
    async: false,
    wrapped,
    default: default_ as TDefault,
    _parse(input, config) {
      // If input is `null`, return typed schema result or override it with
      // default value
      if (input === null) {
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
