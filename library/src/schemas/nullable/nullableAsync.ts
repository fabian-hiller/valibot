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
  TSchema extends BaseSchema | BaseSchemaAsync,
  TDefault extends
    | Input<TSchema>
    | null
    | undefined
    | Promise<Input<TSchema> | null | undefined> = undefined,
  TOutput = Awaited<TDefault> extends undefined | null
    ? Output<TSchema> | null
    : Output<TSchema>
> = BaseSchemaAsync<Input<TSchema> | null, TOutput> & {
  schema: 'nullable';
  wrapped: TSchema;
  getDefault: () => Promise<TDefault>;
};

/**
 * Creates an async nullable schema.
 *
 * @param schema The wrapped schema.
 * @param value The default value.
 *
 * @returns An async nullable schema.
 */
export function nullableAsync<
  TSchema extends BaseSchema | BaseSchemaAsync,
  TDefault extends
    | Input<TSchema>
    | null
    | undefined
    | Promise<Input<TSchema> | null | undefined> = undefined
>(
  schema: TSchema,
  value?: TDefault | (() => TDefault)
): NullableSchemaAsync<TSchema, TDefault> {
  return {
    /**
     * The schema type.
     */
    schema: 'nullable',

    /**
     * The wrapped schema.
     */
    wrapped: schema,

    /**
     * Returns the default value.
     *
     * @returns The default value.
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
        input === null &&
        (default_ = await this.getDefault()) &&
        default_ !== undefined
          ? default_
          : input;

      // Allow `null` value to pass
      if (value === null) {
        return getOutput(value);
      }

      // Return result of wrapped schema
      return schema._parse(value, info);
    },
  };
}
