import { ValiError } from '../../error/index.ts';
import type { BaseSchema, Input, Output } from '../../types.ts';
import { getIssue } from '../../utils/index.ts';

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
          getIssue(info, {
            reason: 'type',
            validation: 'non_nullable',
            message: error || 'Invalid type',
            input,
          }),
        ]);
      }

      // Parse wrapped schema and return output
      return wrapped.parse(input, info);
    },
  };
}
