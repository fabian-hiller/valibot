import type {
  BaseSchema,
  BaseSchemaAsync,
  ErrorMessage,
  Input,
  Output,
} from '../../types.ts';
import { getSchemaIssues } from '../../utils/index.ts';
import type { NonNullable } from './nonNullable.ts';

/**
 * Non nullable schema async type.
 */
export type NonNullableSchemaAsync<
  TSchema extends BaseSchema | BaseSchemaAsync,
  TOutput = NonNullable<Output<TSchema>>
> = BaseSchemaAsync<NonNullable<Input<TSchema>>, TOutput> & {
  schema: 'non_nullable';
  wrapped: TSchema;
};

/**
 * Creates an async non nullable schema.
 *
 * @param schema The wrapped schema.
 * @param error The error message.
 *
 * @returns An async non nullable schema.
 */
export function nonNullableAsync<TSchema extends BaseSchema | BaseSchemaAsync>(
  schema: TSchema,
  error?: ErrorMessage
): NonNullableSchemaAsync<TSchema> {
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
