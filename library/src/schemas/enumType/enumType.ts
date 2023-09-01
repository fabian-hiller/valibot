import { getIssues } from '../../utils/index.ts';

import type { BaseSchema, FString } from '../../types.ts';
import type { Enum } from './types.ts';

/**
 * Enum schema type.
 */
export type EnumSchema<
  TEnum extends Enum,
  TOutput = TEnum[number]
> = BaseSchema<TEnum[number], TOutput> & {
  schema: 'enum';
  enum: TEnum;
};

/**
 * Creates a enum schema.
 *
 * @param enumValue The enum value.
 * @param error The error message.
 *
 * @returns A enum schema.
 */
export function enumType<TOption extends string, TEnum extends Enum<TOption>>(
  enumValue: TEnum,
  error?: FString
): EnumSchema<TEnum> {
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
    async: false,

    /**
     * Parses unknown input based on its schema.
     *
     * @param input The input to be parsed.
     * @param info The parse info.
     *
     * @returns The parsed output.
     */
    _parse(input, info) {
      // Check type of input
      if (!enumValue.includes(input as any)) {
        return getIssues(info, 'type', 'enum', error || 'Invalid type', input);
      }

      // Return inpot as output
      return { output: input as TEnum[number] };
    },
  };
}
