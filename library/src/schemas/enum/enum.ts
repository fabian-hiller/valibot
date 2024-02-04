import type {
  BaseSchema,
  ErrorMessage,
  ErrorMessageOrMetadata,
} from '../../types/index.ts';
import { defaultArgs, parseResult, schemaIssue } from '../../utils/index.ts';

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
  message: ErrorMessage;
};

/**
 * Creates an enum schema.
 *
 * @param enum_ The enum value.
 * @param messageOrMetadata The error message or schema metadata.
 *
 * @returns An enum schema.
 */
export function enum_<TEnum extends Enum>(
  enum_: TEnum,
  messageOrMetadata?: ErrorMessageOrMetadata
): EnumSchema<TEnum> {
  // Create cached values
  let cachedValues: (string | number)[];

  // Extract message and metadata
  const [message = 'Invalid type', , metadata] = defaultArgs(
    messageOrMetadata,
    undefined
  );

  // Create and return enum schema
  return {
    type: 'enum',
    async: false,
    enum: enum_,
    message,
    metadata,
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
