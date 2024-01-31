import type { BaseSchema, ErrorMessage } from '../../types/index.ts';
import { parseResult, schemaIssue, stringify } from '../../utils/index.ts';

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
};

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
      // Check type of input
      if (!values.includes(input as any)) {
        return schemaIssue(this, enum_, input, config);
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
