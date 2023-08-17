import type { BaseSchema, Input, Output } from '../../types.ts';
import { getLeafIssue } from '../../utils/index.ts';

/**
 * Non optional type.
 */
export type NonOptional<T> = T extends undefined ? never : T;

/**
 * Non optional schema type.
 */
export type NonOptionalSchema<
  TWrappedSchema extends BaseSchema,
  TOutput = NonOptional<Output<TWrappedSchema>>
> = BaseSchema<NonOptional<Input<TWrappedSchema>>, TOutput> & {
  schema: 'non_optional';
  wrapped: TWrappedSchema;
};

/**
 * Creates a non optional schema.
 *
 * @param wrapped The wrapped schema.
 * @param error The error message.
 *
 * @returns A non optional schema.
 */
export function nonOptional<TWrappedSchema extends BaseSchema>(
  wrapped: TWrappedSchema,
  error?: string
): NonOptionalSchema<TWrappedSchema> {
  return {
    /**
     * The schema type.
     */
    schema: 'non_optional',

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
    _parse(input, info) {
      // Allow `undefined` values not to pass
      if (input === undefined) {
        return {
          issues: [
            getLeafIssue({
              reason: 'type',
              validation: 'non_optional',
              message: error || 'Invalid type',
              input,
            }),
          ],
        };
      }

      // Return result of wrapped schema
      return wrapped._parse(input, info);
    },
  };
}
