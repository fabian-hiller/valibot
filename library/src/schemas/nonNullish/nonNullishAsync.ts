import { i18next } from '../../i18n.ts';
import { ValiError } from '../../error/index.ts';
import type {
  BaseSchema,
  BaseSchemaAsync,
  Input,
  Output,
} from '../../types.ts';
import type { NonNullish } from './nonNullish.ts';

/**
 * Non nullish schema async type.
 */
export type NonNullishSchemaAsync<
  TWrappedSchema extends BaseSchema | BaseSchemaAsync,
  TOutput = NonNullish<Output<TWrappedSchema>>
> = BaseSchemaAsync<NonNullish<Input<TWrappedSchema>>, TOutput> & {
  schema: 'non_nullish';
  wrapped: TWrappedSchema;
};

/**
 * Creates an async non nullish schema.
 *
 * @param wrapped The wrapped schema.
 * @param error The error message.
 *
 * @returns An async non nullish schema.
 */
export function nonNullishAsync<
  TWrappedSchema extends BaseSchema | BaseSchemaAsync
>(
  wrapped: TWrappedSchema,
  error?: string
): NonNullishSchemaAsync<TWrappedSchema> {
  return {
    /**
     * The schema type.
     */
    schema: 'non_nullish',

    /**
     * The wrapped schema.
     */
    wrapped,

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
    async parse(input, info) {
      // Allow `null` and `undefined` values not to pass
      if (input === null || input === undefined) {
        throw new ValiError([
          {
            reason: 'type',
            validation: 'non_nullish',
            origin: 'value',
            message: error || i18next.t("schemas.nonNullishAsync"),
            input,
            ...info,
          },
        ]);
      }

      // Parse wrapped schema and return output
      return wrapped.parse(input, info);
    },
  };
}
