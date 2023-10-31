import type {
  BaseSchema,
  BaseSchemaAsync,
  Input,
  Output,
} from '../../types.ts';
import { getOutput } from '../../utils/index.ts';

/**
 * Nullable schema async type.
 */
export type NullableSchemaAsync<
  TWrapped extends BaseSchema | BaseSchemaAsync,
  TDefault extends
    | Input<TWrapped>
    | undefined
    | Promise<Input<TWrapped> | undefined> = undefined,
  TOutput = Awaited<TDefault> extends Input<TWrapped>
    ? Output<TWrapped>
    : Output<TWrapped> | null
> = BaseSchemaAsync<Input<TWrapped> | null, TOutput> & {
  type: 'nullable';
  /**
   * The wrapped schema.
   */
  wrapped: TWrapped;
  /**
   * Returns the default value.
   */
  getDefault: () => Promise<TDefault>;
};

/**
 * Creates an async nullable schema.
 *
 * @param wrapped The wrapped schema.
 * @param default_ The default value.
 *
 * @returns An async nullable schema.
 */
export function nullableAsync<
  TWrapped extends BaseSchema | BaseSchemaAsync,
  TDefault extends
    | Input<TWrapped>
    | undefined
    | Promise<Input<TWrapped> | undefined> = undefined
>(
  wrapped: TWrapped,
  default_?: TDefault | (() => TDefault)
): NullableSchemaAsync<TWrapped, TDefault> {
  return {
    type: 'nullable',
    async: true,
    wrapped,
    async getDefault() {
      return typeof default_ === 'function'
        ? (default_ as () => TDefault)()
        : (default_ as TDefault);
    },
    async _parse(input, info) {
      // Allow `null` to pass or override it with default value
      if (input === null) {
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
