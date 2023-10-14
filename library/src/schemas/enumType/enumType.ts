import type { BaseSchema, ErrorMessage } from '../../types.ts';
import { getSchemaIssues, getOutput } from '../../utils/index.ts';
import type { Enum } from './types.ts';

/**
 * Enum schema type.
 */
export type EnumSchema<
  TEnum extends Enum,
  TOutput = TEnum[number]
> = BaseSchema<TEnum[number], TOutput> & {
  kind: 'enum';
  /**
   * The enum value.
   */
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
  error?: ErrorMessage
): EnumSchema<TEnum> {
  return {
    kind: 'enum',
    async: false,
    enum: enumValue,
    _parse(input, info) {
      // Check type of input
      if (!enumValue.includes(input as any)) {
        return getSchemaIssues(
          info,
          'type',
          'enum',
          error || 'Invalid type',
          input
        );
      }

      // Return inpot as output
      return getOutput(input as TEnum[number]);
    },
  };
}
