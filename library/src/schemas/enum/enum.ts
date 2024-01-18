import type { BaseSchema, ErrorMessage } from '../../types/index.ts';
import { parseResult, schemaIssue } from '../../utils/index.ts';

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
export interface EnumSchema<TEnum extends Enum, TOutput = TEnum[keyof TEnum]>
  extends BaseSchema<TEnum[keyof TEnum], TOutput> {
  /**
   * The schema type.
   */
  type: 'enum';
  /**
   * The enum value.
   */
  enum: TEnum;
  /**
   * The error message.
   */
  message: ErrorMessage;
}

/**
 * Creates an enum schema.
 *
 * @param enum_ The enum value.
 * @param message The error message.
 *
 * @returns An enum schema.
 */
export function enum_<TEnum extends Enum>(
  enum_: TEnum,
  message: ErrorMessage = 'Invalid type'
): EnumSchema<TEnum> {
  // Create cached values
  let cachedValues: (string | number)[];

  // Create and return enum schema
  return {
    type: 'enum',
    async: false,
    enum: enum_,
    message,
    _parse(input, info) {
      // Cache values lazy
      cachedValues = cachedValues || Object.values(this.enum);

      // Check type of input
      if (!cachedValues.includes(input as any)) {
        return schemaIssue(info, 'type', 'enum', this.message, input);
      }

      // Return parse result
      return parseResult(true, input as TEnum[keyof TEnum]);
    },
  };
}

/**
 * See {@link enum_}
 *
 * @deprecated Use `enum_` instead.
 */
export const nativeEnum = enum_;
