import type {
  BaseSchema,
  ErrorMessage,
  ErrorMessageOrMetadata,
} from '../../types/index.ts';
import { defaultArgs, parseResult, schemaIssue } from '../../utils/index.ts';
import type { PicklistOptions } from './types.ts';

/**
 * Picklist schema type.
 */
export type PicklistSchema<
  TOptions extends PicklistOptions,
  TOutput = TOptions[number]
> = BaseSchema<TOptions[number], TOutput> & {
  /**
   * The schema type.
   */
  type: 'picklist';
  /**
   * The picklist options.
   */
  options: TOptions;
  /**
   * The error message.
   */
  message: ErrorMessage;
};

/**
 * Creates a picklist schema.
 *
 * @param options The picklist value.
 * @param messageOrMetadata The error message or schema metadata.
 *
 * @returns A picklist schema.
 */
export function picklist<const TOptions extends PicklistOptions>(
  options: TOptions,
  messageOrMetadata?: ErrorMessageOrMetadata
): PicklistSchema<TOptions> {
  // Extracts the message and metadata from the input.
  const [message = 'Invalid type', , metadata] = defaultArgs(
    messageOrMetadata,
    undefined
  );
  return {
    type: 'picklist',
    async: false,
    options,
    message,
    metadata,
    _parse(input, info) {
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
 * See {@link picklist}
 *
 * @deprecated Use `picklist` instead.
 */
export const enumType = picklist;
