import type { BaseSchema, ErrorMessage } from '../../types/index.ts';
import { schemaIssue, schemaResult, stringify } from '../../utils/index.ts';
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
  message: ErrorMessage | undefined;
};

/**
 * Creates a picklist schema.
 *
 * @param options The picklist value.
 * @param message The error message.
 *
 * @returns A picklist schema.
 */
export function picklist<const TOptions extends PicklistOptions>(
  options: TOptions,
  message?: ErrorMessage
): PicklistSchema<TOptions> {
  return {
    type: 'picklist',
    expects: options.map(stringify).join(' | '),
    async: false,
    options,
    message,
    _parse(input, config) {
      // If type is valid, return schema result
      if (this.options.includes(input as any)) {
        return schemaResult(true, input as TOptions[number]);
      }

      // Otherwise, return schema issue
      return schemaIssue(this, picklist, input, config);
    },
  };
}

/**
 * See {@link picklist}
 *
 * @deprecated Use `picklist` instead.
 */
export const enumType = picklist;
