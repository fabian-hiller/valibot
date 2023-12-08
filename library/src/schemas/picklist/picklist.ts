import type { BaseSchema, ErrorMessage } from '../../types/index.ts';
import { parseResult, schemaIssue } from '../../utils/index.ts';
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
 * @param message The error message.
 *
 * @returns A picklist schema.
 */
export function picklist<
  TOption extends string,
  TOptions extends PicklistOptions<TOption>
>(
  options: TOptions,
  message: ErrorMessage = 'Invalid type'
): PicklistSchema<TOptions> {
  return {
    type: 'picklist',
    async: false,
    options,
    message,
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
