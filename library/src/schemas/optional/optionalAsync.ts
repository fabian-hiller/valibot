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
  TSchema extends BaseSchema | BaseSchemaAsync,
  TDefault extends
    | Input<TSchema>
    | undefined
    | Promise<Input<TSchema> | undefined> = undefined,
  TOutput = Awaited<TDefault> extends Input<TSchema>
    ? Output<TSchema>
    : Output<TSchema> | undefined
> = BaseSchemaAsync<Input<TSchema> | undefined, TOutput> & {
  schema: 'optional';
  wrapped: TSchema;
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
  TSchema extends BaseSchema | BaseSchemaAsync,
  TDefault extends
    | Input<TSchema>
    | undefined
    | Promise<Input<TSchema> | undefined> = undefined
>(
  wrapped: TSchema,
  default_?: TDefault | (() => TDefault)
): OptionalSchemaAsync<TSchema, TDefault> {
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
