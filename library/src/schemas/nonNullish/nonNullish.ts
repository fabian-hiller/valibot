import type {
  BaseSchema,
  ErrorMessage,
  Input,
  Output,
} from '../../types/index.ts';
import { getSchemaIssues } from '../../utils/index.ts';

/**
 * Non nullish type.
 */
export type NonNullish<T> = T extends null | undefined ? never : T;

/**
 * Non nullish schema type.
 */
export type NonNullishSchema<
  TWrapped extends BaseSchema,
  TOutput = NonNullish<Output<TWrapped>>
> = BaseSchema<NonNullish<Input<TWrapped>>, TOutput> & {
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
  message: ErrorMessage;
};

/**
 * Creates a non nullish schema.
 *
 * @param wrapped The wrapped schema.
 * @param message The error message.
 *
 * @returns A non nullish schema.
 */
export function nonNullish<TWrapped extends BaseSchema>(
  wrapped: TWrapped,
  message: ErrorMessage = 'Invalid type'
): NonNullishSchema<TWrapped> {
  return {
    type: 'non_nullish',
    async: false,
    wrapped,
    message,
    _parse(input, info) {
      // Allow `null` and `undefined` values not to pass
      if (input === null || input === undefined) {
        return getSchemaIssues(
          info,
          'type',
          'non_nullish',
          this.message,
          input
        );
      }

      // Return result of wrapped schema
      return this.wrapped._parse(input, info);
    },
  };
}
