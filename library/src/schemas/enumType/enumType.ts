import { i18next } from '../../i18n.ts';
import { ValiError } from '../../error/index.ts';
import type { BaseSchema } from '../../types.ts';

/**
 * Enum value type.
 */
export type EnumValue = Readonly<[string, ...string[]]>;

/**
 * Enum schema type.
 */
export type EnumSchema<
  TEnumValue extends EnumValue,
  TOutput = TEnumValue[number]
> = BaseSchema<TEnumValue[number], TOutput> & {
  schema: 'enum';
  enum: TEnumValue;
};

/**
 * Creates a enum schema.
 *
 * @param enum The enum value.
 * @param error The error message.
 *
 * @returns A enum schema.
 */
export function enumType<TEnumValue extends EnumValue>(
  enumValue: TEnumValue,
  error?: string
): EnumSchema<TEnumValue> {
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
    parse(input, info) {
      // Check type of input
      if (!enumValue.includes(input as any)) {
        throw new ValiError([
          {
            reason: 'type',
            validation: 'enum',
            origin: 'value',
            message: error || i18next.t("schemas.enumType"),
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
