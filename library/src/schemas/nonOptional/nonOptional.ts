import type { BaseSchema, ErrorMessage, Input, Output } from '../../types.ts';
import { getSchemaIssues } from '../../utils/index.ts';

/**
 * Non optional type.
 */
export type NonOptional<T> = T extends undefined ? never : T;

/**
 * Non optional schema type.
 */
export type NonOptionalSchema<
  TSchema extends BaseSchema,
  TOutput = NonOptional<Output<TSchema>>
> = BaseSchema<NonOptional<Input<TSchema>>, TOutput> & {
  schema: 'non_optional';
  wrapped: TSchema;
};

/**
 * Creates a non optional schema.
 *
 * @param schema The wrapped schema.
 * @param error The error message.
 *
 * @returns A non optional schema.
 */
export function nonOptional<TSchema extends BaseSchema>(
  schema: TSchema,
  error?: ErrorMessage
): NonOptionalSchema<TSchema> {
  return {
    /**
     * The schema type.
     */
    schema: 'non_optional',

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
      // Allow `undefined` values not to pass
      if (input === undefined) {
        return getSchemaIssues(
          info,
          'type',
          'non_optional',
          error || 'Invalid type',
          input
        );
      }

      // Return result of wrapped schema
      return schema._parse(input, info);
    },
  };
}
