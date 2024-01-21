import type { BaseSchema, ErrorMessage } from '../../types/index.ts';
import { schemaIssue } from '../../utils/index.ts';
import type { NonOptionalInput, NonOptionalOutput } from './types.ts';

/**
 * Non optional schema type.
 */
export interface NonOptionalSchema<
  TWrapped extends BaseSchema,
  TOutput = NonOptionalOutput<TWrapped>
> extends BaseSchema<NonOptionalInput<TWrapped>, TOutput> {
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
}

/**
 * Creates a non optional schema.
 *
 * @param wrapped The wrapped schema.
 * @param message The error message.
 *
 * @returns A non optional schema.
 */
export function nonOptional<TWrapped extends BaseSchema>(
  wrapped: TWrapped,
  message: ErrorMessage = 'Invalid type'
): NonOptionalSchema<TWrapped> {
  return {
    type: 'non_optional',
    async: false,
    wrapped,
    message,
    _parse(input, info) {
      // Allow `undefined` values not to pass
      if (input === undefined) {
        return schemaIssue(info, 'type', 'non_optional', this.message, input);
      }

      // Return result of wrapped schema
      return this.wrapped._parse(input, info);
    },
  };
}
