import type {
  BaseSchema,
  ErrorMessage,
  ErrorMessageOrMetadata,
} from '../../types/index.ts';
import { defaultArgs, schemaIssue } from '../../utils/index.ts';
import type { NonNullishInput, NonNullishOutput } from './types.ts';

/**
 * Non nullish schema type.
 */
export type NonNullishSchema<
  TWrapped extends BaseSchema,
  TOutput = NonNullishOutput<TWrapped>
> = BaseSchema<NonNullishInput<TWrapped>, TOutput> & {
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
};

/**
 * Creates a non nullish schema.
 *
 * @param wrapped The wrapped schema.
 * @param messageOrMetadata The error message or schema metadata.
 *
 * @returns A non nullish schema.
 */
export function nonNullish<TWrapped extends BaseSchema>(
  wrapped: TWrapped,
  messageOrMetadata?: ErrorMessageOrMetadata
): NonNullishSchema<TWrapped> {
  // Extracts the message and metadata from the input.
  const [message = 'Invalid type', , metadata] = defaultArgs(
    messageOrMetadata,
    undefined
  );
  return {
    type: 'non_nullish',
    expects: '!null & !undefined',
    async: false,
    wrapped,
    message,
    get metadata() {
      return metadata ?? this.wrapped.metadata;
    },
    _parse(input, config) {
      // Allow `null` and `undefined` values not to pass
      if (input === null || input === undefined) {
        return schemaIssue(this, nonNullish, input, config);
      }

      // Otherwise, return result of wrapped schema
      return this.wrapped._parse(input, config);
    },
  };
}
