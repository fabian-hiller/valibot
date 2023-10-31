import type {
  BaseSchema,
  BaseSchemaAsync,
  Input,
  Output,
} from '../../types.ts';
import { getOutput } from '../../utils/index.ts';

/**
 * Optional schema async type.
 */
export type OptionalSchemaAsync<
  TWrapped extends BaseSchema | BaseSchemaAsync,
  TDefault extends
    | Input<TWrapped>
    | undefined
    | Promise<Input<TWrapped> | undefined> = undefined,
  TOutput = Awaited<TDefault> extends Input<TWrapped>
    ? Output<TWrapped>
    : Output<TWrapped> | undefined
> = BaseSchemaAsync<Input<TWrapped> | undefined, TOutput> & {
  type: 'optional';
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
 * Creates an async optional schema.
 *
 * @param wrapped The wrapped schema.
 * @param default_ The default value.
 *
 * @returns An async optional schema.
 */
export function optionalAsync<
  TWrapped extends BaseSchema | BaseSchemaAsync,
  TDefault extends
    | Input<TWrapped>
    | undefined
    | Promise<Input<TWrapped> | undefined> = undefined
>(
  wrapped: TWrapped,
  default_?: TDefault | (() => TDefault)
): OptionalSchemaAsync<TWrapped, TDefault> {
  return {
    type: 'optional',
    async: true,
    wrapped,
    async getDefault() {
      return typeof default_ === 'function'
        ? (default_ as () => TDefault)()
        : (default_ as TDefault);
    },
    async _parse(input, info) {
      // Allow `undefined` to pass or override it with default value
      if (input === undefined) {
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
