import type {
  BaseSchema,
  BaseSchemaAsync,
  Input,
  Output,
} from '../../types.ts';
import { getLeafIssue } from '../../utils/index.ts';
import type { NonNullable } from './nonNullable.ts';

/**
 * Non nullable schema async type.
 */
export type NonNullableSchemaAsync<
  TWrappedSchema extends BaseSchema | BaseSchemaAsync,
  TOutput = NonNullable<Output<TWrappedSchema>>
> = BaseSchemaAsync<NonNullable<Input<TWrappedSchema>>, TOutput> & {
  schema: 'non_nullable';
  wrapped: TWrappedSchema;
};

/**
 * Creates an async non nullable schema.
 *
 * @param wrapped The wrapped schema.
 * @param error The error message.
 *
 * @returns An async non nullable schema.
 */
export function nonNullableAsync<
  TWrappedSchema extends BaseSchema | BaseSchemaAsync
>(
  wrapped: TWrappedSchema,
  error?: string
): NonNullableSchemaAsync<TWrappedSchema> {
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
      // Allow `null` values not to pass
      if (input === null) {
        return {
          issues: [
            getLeafIssue({
              reason: 'type',
              validation: 'non_nullable',
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
