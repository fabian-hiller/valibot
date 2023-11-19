import type {
  BaseSchema,
  ErrorMessage,
  Input,
  Output,
} from '../../types/index.ts';
import { getSchemaIssues } from '../../utils/index.ts';

/**
 * Non nullable type.
 */
export type NonNullable<T> = T extends null ? never : T;

/**
 * Non nullable schema type.
 */
export interface NonNullableSchema<
  TWrapped extends BaseSchema,
  TOutput = NonNullable<Output<TWrapped>>
> extends BaseSchema<NonNullable<Input<TWrapped>>, TOutput> {
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
  message: ErrorMessage;
}

/**
 * Creates a non nullable schema.
 *
 * @param wrapped The wrapped schema.
 * @param message The error message.
 *
 * @returns A non nullable schema.
 */
export function nonNullable<TWrapped extends BaseSchema>(
  wrapped: TWrapped,
  message: ErrorMessage = 'Invalid type'
): NonNullableSchema<TWrapped> {
  return {
    type: 'non_nullable',
    async: false,
    wrapped,
    message,
    _parse(input, info) {
      // Allow `null` values not to pass
      if (input === null) {
        return getSchemaIssues(
          info,
          'type',
          'non_nullable',
          this.message,
          input
        );
      }

      // Return result of wrapped schema
      return this.wrapped._parse(input, info);
    },
  };
}
