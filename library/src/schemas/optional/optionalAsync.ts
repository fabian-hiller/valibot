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
  schema: 'optional';
  wrapped: TWrapped;
  getDefault(): Promise<TDefault>;
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
    /**
     * The schema type.
     */
    schema: 'optional',

    /**
     * The wrapped schema.
     */
    wrapped,

    /**
     * Returns the default value.
     */
    async getDefault() {
      return typeof default_ === 'function'
        ? (default_ as () => TDefault)()
        : (default_ as TDefault);
    },

    /**
     * Whether it's async.
     */
    async: true,

    /**
     * Parses unknown input based on its schema.
     *
     * @param input The input to be parsed.
     * @param info The parse info.
     *
     * @returns The parsed output.
     */
    async _parse(input, info) {
      // Get default or input value
      const value = input === undefined ? await this.getDefault() : input;

      // Allow `undefined` value to pass
      if (value === undefined) {
        return getOutput(value);
      }

      // Return result of wrapped schema
      return wrapped._parse(value, info);
    },
  };
}
