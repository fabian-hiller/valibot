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
  TOutput = Awaited<TDefault> extends undefined
    ? Output<TWrapped> | undefined
    : Output<TWrapped>
> = BaseSchemaAsync<Input<TWrapped> | undefined, TOutput> & {
  kind: 'optional';
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
    kind: 'optional',
    async: true,
    wrapped,
    get default() {
      return typeof default_ === 'function'
        ? (default_ as () => TDefault)()
        : (default_ as TDefault);
    },
    async _parse(input, info) {
      // Get default or input value
      const value = input === undefined ? await this.default : input;

      // Allow `undefined` value to pass
      if (value === undefined) {
        return getOutput(value);
      }

      // Return result of wrapped schema
      return wrapped._parse(value, info);
    },
  };
}
