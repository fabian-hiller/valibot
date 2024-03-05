import { getDefaultAsync } from '../../methods/index.ts';
import type {
  BaseSchema,
  BaseSchemaAsync,
  Input,
  Output,
} from '../../types/index.ts';
import { schemaResult } from '../../utils/index.ts';

/**
 * Nullish schema async type.
 */
export type NullishSchemaAsync<
  TWrapped extends BaseSchema | BaseSchemaAsync,
  TDefault extends
    | Input<TWrapped>
    | (() => Input<TWrapped> | Promise<Input<TWrapped> | undefined> | undefined)
    | undefined = undefined,
  TOutput = TDefault extends
    | Input<TWrapped>
    | (() => Input<TWrapped> | Promise<Input<TWrapped>>)
    ? Output<TWrapped>
    : Output<TWrapped> | null | undefined,
> = BaseSchemaAsync<Input<TWrapped> | null | undefined, TOutput> & {
  /**
   * The schema type.
   */
  type: 'nullish';
  /**
   * The wrapped schema.
   */
  wrapped: TWrapped;
  /**
   * Retutns the default value.
   */
  default: TDefault;
};

/**
 * Creates an async nullish schema.
 *
 * @param wrapped The wrapped schema.
 *
 * @returns An async nullish schema.
 */
export function nullishAsync<TWrapped extends BaseSchema | BaseSchemaAsync>(
  wrapped: TWrapped
): NullishSchemaAsync<TWrapped>;

/**
 * Creates an async nullish schema.
 *
 * @param wrapped The wrapped schema.
 * @param default_ The default value.
 *
 * @returns An async nullish schema.
 */
export function nullishAsync<
  TWrapped extends BaseSchema | BaseSchemaAsync,
  TDefault extends
    | Input<TWrapped>
    | (() => Input<TWrapped> | Promise<Input<TWrapped> | undefined> | undefined)
    | undefined,
>(
  wrapped: TWrapped,
  default_: TDefault
): NullishSchemaAsync<TWrapped, TDefault>;

export function nullishAsync<
  TWrapped extends BaseSchema | BaseSchemaAsync,
  TDefault extends
    | Input<TWrapped>
    | (() => Input<TWrapped> | Promise<Input<TWrapped> | undefined> | undefined)
    | undefined = undefined,
>(
  wrapped: TWrapped,
  default_?: TDefault
): NullishSchemaAsync<TWrapped, TDefault> {
  return {
    type: 'nullish',
    expects: `${wrapped.expects} | null | undefined`,
    async: true,
    wrapped,
    default: default_ as TDefault,
    async _parse(input, config) {
      // If input is `null` or `undefined`, return typed schema result or
      // override it with default value
      if (input === null || input === undefined) {
        const override = await getDefaultAsync(this);
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
