import type {
  BaseSchema,
  ErrorMessage,
  ErrorMessageOrMetadata,
} from '../../types/index.ts';
import {
  defaultArgs,
  schemaIssue,
  schemaResult,
  stringify,
} from '../../utils/index.ts';

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
  TOutput = TEnum[keyof TEnum],
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
 * @param messageOrMetadata The error message or schema metadata.
 *
 * @returns An enum schema.
 */
export function enum_<TEnum extends Enum>(
  enum__: TEnum,
  messageOrMetadata?: ErrorMessageOrMetadata
): EnumSchema<TEnum> {
  // Get values
  const values = Object.values(enum__);

  // Extract message and metadata
  const [message, , metadata] = defaultArgs(messageOrMetadata, undefined);

  // Create and return enum schema
  return {
    type: 'enum',
    expects: values.map(stringify).join(' | '),
    async: false,
    enum: enum__,
    message,
    metadata,
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

/**
 * See {@link enum_}
 *
 * @deprecated Use `enum_` instead.
 */
export const nativeEnum = enum_;
