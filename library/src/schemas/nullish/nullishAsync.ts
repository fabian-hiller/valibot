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
  TSchema extends BaseSchema | BaseSchemaAsync,
  TDefault extends
    | Input<TSchema>
    | null
    | undefined
    | Promise<Input<TSchema> | null | undefined> = undefined,
  TOutput = Awaited<TDefault> extends undefined | null
    ? Output<TSchema> | null | undefined
    : Output<TSchema>
> = BaseSchemaAsync<Input<TSchema> | null | undefined, TOutput> & {
  schema: 'nullish';
  wrapped: TSchema;
  getDefault: () => Promise<TDefault>;
};

/**
 * Creates an async nullish schema.
 *
 * @param schema The wrapped schema.
 * @param value The default value.
 *
 * @returns An async nullish schema.
 */
export function nullishAsync<
  TSchema extends BaseSchema | BaseSchemaAsync,
  TDefault extends
    | Input<TSchema>
    | undefined
    | Promise<Input<TSchema> | null | undefined> = undefined
>(
  schema: TSchema,
  value?: TDefault | (() => TDefault)
): NullishSchemaAsync<TSchema, TDefault> {
  return {
    /**
     * The schema type.
     */
    schema: 'nullish',

    /**
     * The wrapped schema.
     */
    wrapped: schema,

    /**
     * Retutns the default value.
     */
    async getDefault() {
      return typeof value === 'function'
        ? (value as () => TDefault)()
        : (value as TDefault);
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
      return schema._parse(value, info);
    },
  };
}
