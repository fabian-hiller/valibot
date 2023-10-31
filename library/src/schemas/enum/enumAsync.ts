import type { BaseSchemaAsync, ErrorMessage } from '../../types.ts';
import { getSchemaIssues, getOutput } from '../../utils/index.ts';
import type { Enum } from './enum.ts';

/**
 * Native enum schema async type.
 */
export type EnumSchemaAsync<
  TEnum extends Enum,
  TOutput = TEnum[keyof TEnum]
> = BaseSchemaAsync<TEnum[keyof TEnum], TOutput> & {
  type: 'enum';
  /**
   * The enum value.
   */
  enum: TEnum;
};

/**
 * Creates an async enum schema.
 *
 * @param enum_ The enum value.
 * @param error The error message.
 *
 * @returns An async enum schema.
 */
export function enumAsync<TEnum extends Enum>(
  enum_: TEnum,
  error?: ErrorMessage
): EnumSchemaAsync<TEnum> {
  return {
    type: 'enum',
    async: true,
    enum: enum_,
    async _parse(input, info) {
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
 * See {@link enumAsync}
 *
 * @deprecated Use `enumAsync` instead.
 */
export const nativeEnumAsync = enumAsync;
