import { i18next } from '../../i18n.ts';
import { ValiError } from '../../error/index.ts';
import type { BaseSchema, Input, Output } from '../../types.ts';

/**
 * Non nullable type.
 */
export type NonNullable<T> = T extends null ? never : T;

/**
 * Non nullable schema type.
 */
export type NonNullableSchema<
  TWrappedSchema extends BaseSchema,
  TOutput = NonNullable<Output<TWrappedSchema>>
> = BaseSchema<NonNullable<Input<TWrappedSchema>>, TOutput> & {
  schema: 'non_nullable';
  wrapped: TWrappedSchema;
};

/**
 * Creates a non nullable schema.
 *
 * @param wrapped The wrapped schema.
 * @param error The error message.
 *
 * @returns A non nullable schema.
 */
export function nonNullable<TWrappedSchema extends BaseSchema>(
  wrapped: TWrappedSchema,
  error?: string
): NonNullableSchema<TWrappedSchema> {
  return {
    /**
     * The schema type.
     */
    schema: 'non_nullable',

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
      // Allow `null` values not to pass
      if (input === null) {
        throw new ValiError([
          {
            reason: 'type',
            validation: 'non_nullable',
            origin: 'value',
            message: error || i18next.t("schemas.nonNullable"),
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
