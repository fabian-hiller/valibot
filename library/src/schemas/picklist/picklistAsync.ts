import type { BaseSchemaAsync, ErrorMessage } from '../../types/index.ts';
import { parseResult, schemaIssue, stringify } from '../../utils/index.ts';
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
 * @param message The error message.
 *
 * @returns An async picklist schema.
 */
export function picklistAsync<const TOptions extends PicklistOptions>(
  options: TOptions,
  message?: ErrorMessage
): PicklistSchemaAsync<TOptions> {
  return {
    type: 'picklist',
    expects: options.map(stringify).join(' | '),
    async: true,
    options,
    message,
    async _parse(input, config) {
      // Check type of input
      if (!this.options.includes(input as any)) {
        return schemaIssue(this, input, config);
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
