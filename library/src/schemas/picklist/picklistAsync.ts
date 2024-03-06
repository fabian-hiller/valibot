import type { BaseSchemaAsync, ErrorMessage } from '../../types/index.ts';
import { schemaIssue, schemaResult, stringify } from '../../utils/index.ts';
import type { PicklistOptions } from './types.ts';

/**
 * Picklist schema async type.
 */
export interface PicklistSchemaAsync<
  TOptions extends PicklistOptions,
  TOutput = TOptions[number],
> extends BaseSchemaAsync<TOptions[number], TOutput> {
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
}

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
