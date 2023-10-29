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
    | undefined
    | Promise<Input<TSchema> | undefined> = undefined,
  TOutput = Awaited<TDefault> extends Input<TSchema>
    ? Output<TSchema>
    : Output<TSchema> | null | undefined
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
    | Promise<Input<TSchema> | undefined> = undefined
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
      // Allow `null` or `undefined` to pass or override it with default value
      if (input === null || input === undefined) {
        const override = await this.getDefault();
        if (override === undefined) {
          return getOutput(input);
        }
        input = override;
      }

      // Return result of wrapped schema
      return schema._parse(input, info);
    },
  };
}
