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
export type NonOptionalSchemaAsync<
  TWrapped extends BaseSchema | BaseSchemaAsync,
  TOutput = NonOptionalOutput<TWrapped>
> = BaseSchemaAsync<NonOptionalInput<TWrapped>, TOutput> & {
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
  message: ErrorMessage;
};

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
  message: ErrorMessage = 'Invalid type'
): NonOptionalSchemaAsync<TWrapped> {
  return {
    type: 'non_optional',
    async: true,
    wrapped,
    message,
    async _parse(input, info) {
      // Allow `undefined` values not to pass
      if (input === undefined) {
        return schemaIssue(info, 'type', 'non_optional', this.message, input);
      }

      // Return result of wrapped schema
      return this.wrapped._parse(input, info);
    },
  };
}
