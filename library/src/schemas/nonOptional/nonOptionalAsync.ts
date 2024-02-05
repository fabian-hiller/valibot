import type {
  BaseSchema,
  BaseSchemaAsync,
  ErrorMessage,
} from '../../types/index.ts';
import { schemaIssue } from '../../utils/index.ts';
import type { NonOptionalInput, NonOptionalOutput } from './types.ts';

/**
 * Non optional schema async type.
 */
export interface NonOptionalSchemaAsync<
  TWrapped extends BaseSchema | BaseSchemaAsync,
  TOutput = NonOptionalOutput<TWrapped>
> extends BaseSchemaAsync<NonOptionalInput<TWrapped>, TOutput> {
  /**
   * The schema type.
   */
  type: 'non_optional';
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
 * Creates an async non optional schema.
 *
 * @param wrapped The wrapped schema.
 * @param message The error message.
 *
 * @returns An async non optional schema.
 */
export function nonOptionalAsync<TWrapped extends BaseSchema | BaseSchemaAsync>(
  wrapped: TWrapped,
  message?: ErrorMessage
): NonOptionalSchemaAsync<TWrapped> {
  return {
    type: 'non_optional',
    expects: '!undefined',
    async: true,
    wrapped,
    message,
    async _parse(input, config) {
      // In input is `undefined`, return schema issue
      if (input === undefined) {
        return schemaIssue(this, nonOptionalAsync, input, config);
      }

      // Otherwise, return result of wrapped schema
      return this.wrapped._parse(input, config);
    },
  };
}
