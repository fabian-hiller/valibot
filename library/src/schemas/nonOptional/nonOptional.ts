import type { BaseSchema, ErrorMessage } from '../../types/index.ts';
import { schemaIssue } from '../../utils/index.ts';
import type { NonOptionalInput, NonOptionalOutput } from './types.ts';

/**
 * Non optional schema type.
 */
export type NonOptionalSchema<
  TWrapped extends BaseSchema,
  TOutput = NonOptionalOutput<TWrapped>
> = BaseSchema<NonOptionalInput<TWrapped>, TOutput> & {
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
};

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
  message?: ErrorMessage
): NonOptionalSchema<TWrapped> {
  return {
    type: 'non_optional',
    expects: '!undefined',
    async: false,
    wrapped,
    message,
    _parse(input, config) {
      // Allow `undefined` values not to pass
      if (input === undefined) {
        return schemaIssue(this, nonOptional, input, config);
      }

      // Return result of wrapped schema
      return this.wrapped._parse(input, config);
    },
  };
}
