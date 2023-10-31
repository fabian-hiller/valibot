import type { BaseSchema, ErrorMessage } from '../../types.ts';
import { getSchemaIssues, getOutput } from '../../utils/index.ts';
import type { PicklistOptions } from './types.ts';

/**
 * Picklist schema type.
 */
export type PicklistSchema<
  Toptions extends PicklistOptions,
  TOutput = Toptions[number]
> = BaseSchema<Toptions[number], TOutput> & {
  type: 'picklist';
  /**
   * The picklist options.
   */
  options: Toptions;
};

/**
 * Creates a picklist schema.
 *
 * @param options The picklist value.
 * @param error The error message.
 *
 * @returns A picklist schema.
 */
export function picklist<
  TOption extends string,
  TOptions extends PicklistOptions<TOption>
>(options: TOptions, error?: ErrorMessage): PicklistSchema<TOptions> {
  return {
    type: 'picklist',
    async: false,
    options,
    _parse(input, info) {
      // Check type of input
      if (!options.includes(input as any)) {
        return getSchemaIssues(
          info,
          'type',
          'picklist',
          error || 'Invalid type',
          input
        );
      }

      // Return inpot as output
      return getOutput(input as TOptions[number]);
    },
  };
}

/**
 * See {@link picklist}
 *
 * @deprecated Use `picklist` instead.
 */
export const enumType = picklist;
