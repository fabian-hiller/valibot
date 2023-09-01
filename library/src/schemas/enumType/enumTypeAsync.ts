import { getIssues } from '../../utils/index.ts';

import type { BaseSchemaAsync, FString } from '../../types.ts';
import type { Enum } from './types.ts';

/**
 * Enum schema async type.
 */
export type EnumSchemaAsync<
  TEnum extends Enum,
  TOutput = TEnum[number]
> = BaseSchemaAsync<TEnum[number], TOutput> & {
  schema: 'enum';
  enum: TEnum;
};

/**
 * Creates an async enum schema.
 *
 * @param enumValue The enum value.
 * @param error The error message.
 *
 * @returns An async enum schema.
 */
export function enumTypeAsync<
  TOption extends string,
  TEnum extends Enum<TOption>
>(enumValue: TEnum, error?: FString): EnumSchemaAsync<TEnum> {
  return {
    /**
     * The schema type.
     */
    schema: 'enum',

    /**
     * The enum value.
     */
    enum: enumValue,

    /**
     * Whether it's async.
     */
    async: true,

    /**
     * Parses unknown input based on its schema.
     *
     * @param input The input to be parsed.
     * @param info The parse info.
     *
     * @returns The parsed output.
     */
    async _parse(input, info) {
      // Check type of input
      if (!enumValue.includes(input as any)) {
        return getIssues(info, 'type', 'enum', error || 'Invalid type', input);
      }

      // Return inpot as output
      return { output: input as TEnum[number] };
    },
  };
}
