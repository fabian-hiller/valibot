import type {
  BaseSchemaAsync,
  ErrorMessage,
  ErrorMessageOrMetadata,
} from '../../types/index.ts';
import { defaultArgs, parseResult, schemaIssue } from '../../utils/index.ts';
import type { Enum } from './enum.ts';

/**
 * Native enum schema async type.
 */
export type EnumSchemaAsync<
  TEnum extends Enum,
  TOutput = TEnum[keyof TEnum]
> = BaseSchemaAsync<TEnum[keyof TEnum], TOutput> & {
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
 * Creates an async enum schema.
 *
 * @param enum_ The enum value.
 * @param messageOrMetadata The error message or schema metadata.
 *
 * @returns An async enum schema.
 */
export function enumAsync<TEnum extends Enum>(
  enum_: TEnum,
  messageOrMetadata?: ErrorMessageOrMetadata
): EnumSchemaAsync<TEnum> {
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
    async: true,
    enum: enum_,
    message,
    metadata,
    async _parse(input, info) {
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
 * See {@link enumAsync}
 *
 * @deprecated Use `enumAsync` instead.
 */
export const nativeEnumAsync = enumAsync;
