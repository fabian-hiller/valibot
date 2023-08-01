import { i18next } from '../../i18n.ts';
import { ValiError } from '../../error/index.ts';
import type { BaseSchema, Input, Output } from '../../types.ts';

/**
 * Non nullish type.
 */
export type NonNullish<T> = T extends null | undefined ? never : T;

/**
 * Non nullish schema type.
 */
export type NonNullishSchema<
  TWrappedSchema extends BaseSchema,
  TOutput = NonNullish<Output<TWrappedSchema>>
> = BaseSchema<NonNullish<Input<TWrappedSchema>>, TOutput> & {
  schema: 'non_nullish';
  wrapped: TWrappedSchema;
};

/**
 * Creates a non nullish schema.
 *
 * @param wrapped The wrapped schema.
 * @param error The error message.
 *
 * @returns A non nullish schema.
 */
export function nonNullish<TWrappedSchema extends BaseSchema>(
  wrapped: TWrappedSchema,
  error?: string
): NonNullishSchema<TWrappedSchema> {
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
    async: false,

    /**
     * Parses unknown input based on its schema.
     *
     * @param input The input to be parsed.
     * @param info The parse info.
     *
     * @returns The parsed output.
     */
    parse(input, info) {
      // Allow `null` and `undefined` values not to pass
      if (input === null || input === undefined) {
        throw new ValiError([
          {
            reason: 'type',
            validation: 'non_nullish',
            origin: 'value',
            message: error || i18next.t("schemas.nonNullish"),
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
