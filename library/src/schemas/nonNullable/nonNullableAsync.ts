import type {
  BaseSchema,
  BaseSchemaAsync,
  ErrorMessage,
} from '../../types/index.ts';
import { schemaIssue } from '../../utils/index.ts';
import type { NonNullableInput, NonNullableOutput } from './types.ts';

/**
 * Non nullable schema async type.
 */
export interface NonNullableSchemaAsync<
  TWrapped extends BaseSchema | BaseSchemaAsync,
  TOutput = NonNullableOutput<TWrapped>
> extends BaseSchemaAsync<NonNullableInput<TWrapped>, TOutput> {
  /**
   * The schema type.
   */
  type: 'non_nullable';
  /**
   * The wrapped schema.
   */
  wrapped: TWrapped;
  /**
   * The error message.
   */
  message: ErrorMessage | undefined;
}

/**
 * Creates an async non nullable schema.
 *
 * @param wrapped The wrapped schema.
 * @param message The error message.
 *
 * @returns An async non nullable schema.
 */
export function nonNullableAsync<TWrapped extends BaseSchema | BaseSchemaAsync>(
  wrapped: TWrapped,
  message?: ErrorMessage
): NonNullableSchemaAsync<TWrapped> {
  return {
    type: 'non_nullable',
    expects: '!null',
    async: true,
    wrapped,
    message,
    async _parse(input, config) {
      // In input is `null`, return schema issue
      if (input === null) {
        return schemaIssue(this, nonNullableAsync, input, config);
      }

      // Otherwise, return result of wrapped schema
      return this.wrapped._parse(input, config);
    },
  };
}
