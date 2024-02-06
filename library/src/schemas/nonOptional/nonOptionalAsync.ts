import type {
  BaseSchema,
  BaseSchemaAsync,
  ErrorMessage,
  ErrorMessageOrMetadata,
} from '../../types/index.ts';
import { defaultArgs, schemaIssue } from '../../utils/index.ts';
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
  message: ErrorMessage | undefined;
};

/**
 * Creates an async non optional schema.
 *
 * @param wrapped The wrapped schema.
 * @param messageOrMetadata The error message or schema metadata.
 *
 * @returns An async non optional schema.
 */
export function nonOptionalAsync<TWrapped extends BaseSchema | BaseSchemaAsync>(
  wrapped: TWrapped,
  messageOrMetadata?: ErrorMessageOrMetadata
): NonOptionalSchemaAsync<TWrapped> {
  // Extracts the message and metadata from the input.
  const [message = 'Invalid type', , metadata] = defaultArgs(
    messageOrMetadata,
    undefined
  );
  return {
    type: 'non_optional',
    expects: '!undefined',
    async: true,
    wrapped,
    message,
    get metadata() {
      return metadata ?? this.wrapped.metadata;
    },
    async _parse(input, config) {
      // Allow `undefined` values not to pass
      if (input === undefined) {
        return schemaIssue(this, nonOptionalAsync, input, config);
      }

      // Otherwise, return result of wrapped schema
      return this.wrapped._parse(input, config);
    },
  };
}
