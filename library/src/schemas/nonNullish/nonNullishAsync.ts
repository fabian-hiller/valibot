import type {
  BaseSchema,
  BaseSchemaAsync,
  ErrorMessage,
} from '../../types/index.ts';
import { schemaIssue } from '../../utils/index.ts';
import type { NonNullishInput, NonNullishOutput } from './types.ts';

/**
 * Non nullish schema async type.
 */
export interface NonNullishSchemaAsync<
  TWrapped extends BaseSchema | BaseSchemaAsync,
  TOutput = NonNullishOutput<TWrapped>,
> extends BaseSchemaAsync<NonNullishInput<TWrapped>, TOutput> {
  /**
   * The schema type.
   */
  type: 'non_nullish';
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
 * Creates an async non nullish schema.
 *
 * @param wrapped The wrapped schema.
 * @param message The error message.
 *
 * @returns An async non nullish schema.
 */
export function nonNullishAsync<TWrapped extends BaseSchema | BaseSchemaAsync>(
  wrapped: TWrapped,
  message?: ErrorMessage
): NonNullishSchemaAsync<TWrapped> {
  return {
    type: 'non_nullish',
    expects: '!null & !undefined',
    async: true,
    wrapped,
    message,
    async _parse(input, config) {
      // In input is `null` or `undefined`, return schema issue
      if (input === null || input === undefined) {
        return schemaIssue(this, nonNullishAsync, input, config);
      }

      // Otherwise, return result of wrapped schema
      return this.wrapped._parse(input, config);
    },
  };
}
