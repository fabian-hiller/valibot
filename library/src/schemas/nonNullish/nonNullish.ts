import type { BaseSchema, ErrorMessage, Input, Output } from '../../types.ts';
import { getSchemaIssues } from '../../utils/index.ts';

/**
 * Non nullish type.
 */
export type NonNullish<T> = T extends null | undefined ? never : T;

/**
 * Non nullish schema type.
 */
export type NonNullishSchema<
  TSchema extends BaseSchema,
  TOutput = NonNullish<Output<TSchema>>
> = BaseSchema<NonNullish<Input<TSchema>>, TOutput> & {
  schema: 'non_nullish';
  wrapped: TSchema;
};

/**
 * Creates a non nullish schema.
 *
 * @param schema The wrapped schema.
 * @param error The error message.
 *
 * @returns A non nullish schema.
 */
export function nonNullish<TSchema extends BaseSchema>(
  schema: TSchema,
  error?: ErrorMessage
): NonNullishSchema<TSchema> {
  return {
    /**
     * The schema type.
     */
    schema: 'non_nullish',

    /**
     * The wrapped schema.
     */
    wrapped: schema,

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
    _parse(input, info) {
      // Allow `null` and `undefined` values not to pass
      if (input === null || input === undefined) {
        return getSchemaIssues(
          info,
          'type',
          'non_nullish',
          error || 'Invalid type',
          input
        );
      }

      // Return result of wrapped schema
      return schema._parse(input, info);
    },
  };
}
