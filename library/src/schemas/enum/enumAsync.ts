import type { BaseSchemaAsync, ErrorMessage } from '../../types/index.ts';
import { getSchemaIssues, getOutput } from '../../utils/index.ts';
import type { Enum } from './enum.ts';

/**
 * Native enum schema async type.
 */
export interface EnumSchemaAsync<
  TEnum extends Enum,
  TOutput = TEnum[keyof TEnum]
> extends BaseSchemaAsync<TEnum[keyof TEnum], TOutput> {
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
 * Creates an async enum schema.
 *
 * @param enum_ The enum value.
 * @param message The error message.
 *
 * @returns An async enum schema.
 */
export function enumAsync<TEnum extends Enum>(
  enum_: TEnum,
  message: ErrorMessage = 'Invalid type'
): EnumSchemaAsync<TEnum> {
  return {
    type: 'enum',
    async: true,
    enum: enum_,
    message,
    async _parse(input, info) {
      // Check type of input
      if (!Object.values(this.enum).includes(input as any)) {
        return getSchemaIssues(info, 'type', 'enum', this.message, input);
      }

      // Return input as output
      return getOutput(input as TEnum[keyof TEnum]);
    },
  };
}

/**
 * See {@link enumAsync}
 *
 * @deprecated Use `enumAsync` instead.
 */
export const nativeEnumAsync = enumAsync;
