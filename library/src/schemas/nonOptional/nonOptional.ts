import type {
  BaseSchema,
  ErrorMessage,
  Input,
  Output,
} from '../../types/index.ts';
import { getSchemaIssues } from '../../utils/index.ts';

/**
 * Non optional type.
 */
export type NonOptional<T> = T extends undefined ? never : T;

/**
 * Non optional schema type.
 */
export interface NonOptionalSchema<
  TWrapped extends BaseSchema,
  TOutput = NonOptional<Output<TWrapped>>
> extends BaseSchema<NonOptional<Input<TWrapped>>, TOutput> {
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
        return getSchemaIssues(
          info,
          'type',
          'non_optional',
          this.message,
          input
        );
      }

      // Return result of wrapped schema
      return this.wrapped._parse(input, info);
    },
  };
}
