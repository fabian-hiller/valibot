import type {
  BaseSchemaAsync,
  ErrorMessage,
  ErrorMessageOrMetadata,
} from '../../types/index.ts';
import {
  defaultArgs,
  schemaIssue,
  schemaResult,
  stringify,
} from '../../utils/index.ts';
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
  message: ErrorMessage | undefined;
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
  const [message, , metadata] = defaultArgs(messageOrMetadata, undefined);
  return {
    type: 'picklist',
    expects: options.map(stringify).join(' | '),
    async: true,
    options,
    message,
    metadata,
    async _parse(input, config) {
      // If type is valid, return schema result
      if (this.options.includes(input as any)) {
        return schemaResult(true, input as TOptions[number]);
      }

      // Otherwise, return schema issue
      return schemaIssue(this, picklistAsync, input, config);
    },
  };
}

/**
 * See {@link picklistAsync}
 *
 * @deprecated Use `picklistAsync` instead.
 */
export const enumTypeAsync = picklistAsync;
