import type { BaseSchema, ErrorMessage } from '../../types/index.ts';
import { schemaIssue, schemaResult, stringify } from '../../utils/index.ts';

/**
 * Enum type.
 */
export interface Enum {
  [key: string]: string | number;
  [key: number]: string;
}

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
  message: ErrorMessage | undefined;
}

/**
 * Creates an enum schema.
 *
 * @param enum__ The enum value.
 * @param message The error message.
 *
 * @returns An enum schema.
 */
export function enum_<TEnum extends Enum>(
  enum__: TEnum,
  message?: ErrorMessage
): EnumSchema<TEnum> {
  // Get values
  const values = Object.values(enum__);

  // Create and return enum schema
  return {
    type: 'enum',
    expects: values.map(stringify).join(' | '),
    async: false,
    enum: enum__,
    message,
    _parse(input, config) {
      // If type is valid, return schema result
      if (values.includes(input as any)) {
        return schemaResult(true, input as TEnum[keyof TEnum]);
      }

      // Otherwise, return schema issue
      return schemaIssue(this, enum_, input, config);
    },
  };
}
