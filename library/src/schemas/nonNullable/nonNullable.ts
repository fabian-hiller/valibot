import type {
  BaseSchema,
  ErrorMessage,
  ErrorMessageOrMetadata,
} from '../../types/index.ts';
import { defaultArgs, schemaIssue } from '../../utils/index.ts';
import type { NonNullableInput, NonNullableOutput } from './types.ts';

/**
 * Non nullable schema type.
 */
export type NonNullableSchema<
  TWrapped extends BaseSchema,
  TOutput = NonNullableOutput<TWrapped>
> = BaseSchema<NonNullableInput<TWrapped>, TOutput> & {
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
  message: ErrorMessage | undefined;
};

/**
 * Creates a non nullable schema.
 *
 * @param wrapped The wrapped schema.
 * @param messageOrMetadata The error message or schema metadata.
 *
 * @returns A non nullable schema.
 */
export function nonNullable<TWrapped extends BaseSchema>(
  wrapped: TWrapped,
  messageOrMetadata?: ErrorMessageOrMetadata
): NonNullableSchema<TWrapped> {
  // Extracts the message and metadata from the input.
  const [message, , metadata] = defaultArgs(messageOrMetadata, undefined);
  return {
    type: 'non_nullable',
    expects: '!null',
    async: false,
    wrapped,
    message,
    get metadata() {
      return metadata ?? this.wrapped.metadata;
    },
    _parse(input, config) {
      // In input is `null`, return schema issue
      if (input === null) {
        return schemaIssue(this, nonNullable, input, config);
      }

      // Otherwise, return result of wrapped schema
      return this.wrapped._parse(input, config);
    },
  };
}
