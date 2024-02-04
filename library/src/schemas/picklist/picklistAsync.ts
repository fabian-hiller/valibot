import type {
  BaseSchemaAsync,
  ErrorMessage,
  ErrorMessageOrMetadata,
} from '../../types/index.ts';
import { defaultArgs, parseResult, schemaIssue } from '../../utils/index.ts';
import type { PicklistOptions } from './types.ts';

/**
 * Picklist schema async type.
 */
export type PicklistSchemaAsync<
  TOptions extends PicklistOptions,
  TOutput = TOptions[number]
> = BaseSchemaAsync<TOptions[number], TOutput> & {
  /**
   * The schema type.
   */
  type: 'picklist';
  /**
   * The picklist value.
   */
  options: TOptions;
  /**
   * The error message.
   */
  message: ErrorMessage;
};

/**
 * Creates an async picklist schema.
 *
 * @param options The picklist options.
 * @param messageOrMetadata The error message or schema metadata.
 *
 * @returns An async picklist schema.
 */
export function picklistAsync<const TOptions extends PicklistOptions>(
  options: TOptions,
  messageOrMetadata?: ErrorMessageOrMetadata
): PicklistSchemaAsync<TOptions> {
  // Extracts the message and metadata from the input.
  const [message = 'Invalid type', , metadata] = defaultArgs(
    messageOrMetadata,
    undefined
  );
  return {
    type: 'picklist',
    async: true,
    options,
    message,
    metadata,
    async _parse(input, info) {
      // Check type of input
      if (!this.options.includes(input as any)) {
        return schemaIssue(info, 'type', 'picklist', this.message, input);
      }

      // Return input as output
      return parseResult(true, input as TOptions[number]);
    },
  };
}

/**
 * See {@link picklistAsync}
 *
 * @deprecated Use `picklistAsync` instead.
 */
export const enumTypeAsync = picklistAsync;
