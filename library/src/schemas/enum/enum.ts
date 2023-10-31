import type { BaseSchema, ErrorMessage } from '../../types.ts';
import { getSchemaIssues, getOutput } from '../../utils/index.ts';

/**
 * Enum type.
 */
export type Enum = {
  [key: string]: string | number;
  [key: number]: string;
};

/**
 * Native enum schema type.
 */
export type EnumSchema<
  TEnum extends Enum,
  TOutput = TEnum[keyof TEnum]
> = BaseSchema<TEnum[keyof TEnum], TOutput> & {
  type: 'enum';
  /**
   * The enum value.
   */
  enum: TEnum;
};

/**
 * Creates a enum schema.
 *
 * @param enum_ The enum value.
 * @param error The error message.
 *
 * @returns A enum schema.
 */
export function enum_<TEnum extends Enum>(
  enum_: TEnum,
  error?: ErrorMessage
): EnumSchema<TEnum> {
  return {
    type: 'enum',
    async: false,
    enum: enum_,
    _parse(input, info) {
      // Check type of input
      if (!Object.values(enum_).includes(input as any)) {
        return getSchemaIssues(
          info,
          'type',
          'enum',
          error || 'Invalid type',
          input
        );
      }

      // Return input as output
      return getOutput(input as TEnum[keyof TEnum]);
    },
  };
}

/**
 * See {@link enum_}
 *
 * @deprecated Use `enum_` instead.
 */
export const nativeEnum = enum_;
