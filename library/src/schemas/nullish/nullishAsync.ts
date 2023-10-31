import type {
  BaseSchema,
  BaseSchemaAsync,
  Input,
  Output,
} from '../../types.ts';
import { getOutput } from '../../utils/index.ts';

/**
 * Nullish schema async type.
 */
export type NullishSchemaAsync<
  TWrapped extends BaseSchema | BaseSchemaAsync,
  TDefault extends
    | Input<TWrapped>
    | undefined
    | Promise<Input<TWrapped> | undefined> = undefined,
  TOutput = Awaited<TDefault> extends Input<TWrapped>
    ? Output<TWrapped>
    : Output<TWrapped> | null | undefined
> = BaseSchemaAsync<Input<TWrapped> | null | undefined, TOutput> & {
  type: 'nullish';
  /**
   * The wrapped schema.
   */
  wrapped: TWrapped;
  /**
   * Retutns the default value.
   */
  getDefault: () => Promise<TDefault>;
};

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
    | undefined
    | Promise<Input<TWrapped> | undefined> = undefined
>(
  wrapped: TWrapped,
  default_?: TDefault | (() => TDefault)
): NullishSchemaAsync<TWrapped, TDefault> {
  return {
    type: 'nullish',
    async: true,
    wrapped,
    async getDefault() {
      return typeof default_ === 'function'
        ? (default_ as () => TDefault)()
        : (default_ as TDefault);
    },
    async _parse(input, info) {
      // Allow `null` or `undefined` to pass or override it with default value
      if (input === null || input === undefined) {
        const override = await this.getDefault();
        if (override === undefined) {
          return getOutput(input);
        }
        input = override;
      }

      // Return result of wrapped schema
      return wrapped._parse(input, info);
    },
  };
}
