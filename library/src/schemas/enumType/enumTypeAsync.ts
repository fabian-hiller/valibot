import { ValiError } from '../../error/index.ts';
import type { BaseSchemaAsync } from '../../types.ts';
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
>(enumValue: TEnum, error?: string): EnumSchemaAsync<TEnum> {
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
    async parse(input, info) {
      // Check type of input
      if (!enumValue.includes(input as any)) {
        throw new ValiError([
          {
            reason: 'type',
            validation: 'enum',
            origin: 'value',
            message: error || 'Invalid type',
            input,
            ...info,
          },
        ]);
      }

      // Return output
      return input as TEnum[number];
    },
  };
}
