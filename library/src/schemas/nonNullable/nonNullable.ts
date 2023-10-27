import type { BaseSchema, ErrorMessage, Input, Output } from '../../types.ts';
import { getSchemaIssues } from '../../utils/index.ts';

/**
 * Non nullable type.
 */
export type NonNullable<T> = T extends null ? never : T;

/**
 * Non nullable schema type.
 */
export type NonNullableSchema<
  TSchema extends BaseSchema,
  TOutput = NonNullable<Output<TSchema>>
> = BaseSchema<NonNullable<Input<TSchema>>, TOutput> & {
  schema: 'non_nullable';
  wrapped: TSchema;
};

/**
 * Creates a non nullable schema.
 *
 * @param schema The wrapped schema.
 * @param error The error message.
 *
 * @returns A non nullable schema.
 */
export function nonNullable<TSchema extends BaseSchema>(
  schema: TSchema,
  error?: ErrorMessage
): NonNullableSchema<TSchema> {
  return {
    /**
     * The schema type.
     */
    schema: 'non_nullable',

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
      // Allow `null` values not to pass
      if (input === null) {
        return getSchemaIssues(
          info,
          'type',
          'non_nullable',
          error || 'Invalid type',
          input
        );
      }

      // Return result of wrapped schema
      return schema._parse(input, info);
    },
  };
}
