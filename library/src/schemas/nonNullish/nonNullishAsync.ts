import type {
  BaseSchema,
  BaseSchemaAsync,
  ErrorMessage,
  Input,
  Output,
} from '../../types.ts';
import { getSchemaIssues } from '../../utils/index.ts';
import type { NonNullish } from './nonNullish.ts';

/**
 * Non nullish schema async type.
 */
export type NonNullishSchemaAsync<
  TWrapped extends BaseSchema | BaseSchemaAsync,
  TOutput = NonNullish<Output<TWrapped>>
> = BaseSchemaAsync<NonNullish<Input<TWrapped>>, TOutput> & {
  type: 'non_nullish';
  /**
   * The wrapped schema.
   */
  wrapped: TWrapped;
};

/**
 * Creates an async non nullish schema.
 *
 * @param wrapped The wrapped schema.
 * @param error The error message.
 *
 * @returns An async non nullish schema.
 */
export function nonNullishAsync<TWrapped extends BaseSchema | BaseSchemaAsync>(
  wrapped: TWrapped,
  error?: ErrorMessage
): NonNullishSchemaAsync<TWrapped> {
  return {
    type: 'non_nullish',
    async: true,
    wrapped,
    async _parse(input, info) {
      // Allow `null` and `undefined` values not to pass
      if (input === null || input === undefined) {
        return getSchemaIssues(
          info,
          'type',
          'non_nullish',
          error || 'Invalid type',
          input
        );
      }

      // Return result of wrapped schema
      return wrapped._parse(input, info);
    },
  };
}
