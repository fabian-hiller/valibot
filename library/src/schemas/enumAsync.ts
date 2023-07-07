import { ValiError } from '../error';
import type { BaseSchemaAsync } from '../types';
import type { EnumValue } from './enum';

/**
 * Enum schema async type.
 */
export type EnumSchemaAsync<
  TEnumValue extends EnumValue,
  TOutput = TEnumValue[number]
> = BaseSchemaAsync<TEnumValue[number], TOutput> & {
  schema: 'enum';
  enum: TEnumValue;
};

/**
 * Creates an async enum schema.
 *
 * @param enum The enum value.
 * @param error The error message.
 *
 * @returns An async enum schema.
 */
export function enumAsync<TEnumValue extends EnumValue>(
  enumValue: TEnumValue,
  error?: string
): EnumSchemaAsync<TEnumValue> {
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
      return input as TEnumValue[number];
    },
  };
}
