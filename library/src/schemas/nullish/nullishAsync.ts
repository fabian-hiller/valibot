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
    | null
    | undefined
    | Promise<Input<TWrapped> | null | undefined> = undefined,
  TOutput = Awaited<TDefault> extends undefined | null
    ? Output<TWrapped> | null | undefined
    : Output<TWrapped>
> = BaseSchemaAsync<Input<TWrapped> | null | undefined, TOutput> & {
  schema: 'nullish';
  wrapped: TWrapped;
  getDefault(): Promise<TDefault>;
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
    | Promise<Input<TWrapped> | null | undefined> = undefined
>(
  wrapped: TWrapped,
  default_?: TDefault | (() => TDefault)
): NullishSchemaAsync<TWrapped, TDefault> {
  return {
    /**
     * The schema type.
     */
    schema: 'nullish',

    /**
     * The wrapped schema.
     */
    wrapped,

    /**
     * Retutns the default value.
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
      let default_: Awaited<TDefault>;
      const value =
        (input === null || input === undefined) &&
        (default_ = await this.getDefault()) &&
        default_ !== undefined
          ? default_
          : input;

      // Allow `null` or `undefined` value to pass
      if (value === null || value === undefined) {
        return getOutput(value);
      }

      // Return result of wrapped schema
      return wrapped._parse(value, info);
    },
  };
}
