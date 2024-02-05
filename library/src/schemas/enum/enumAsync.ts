import type { BaseSchemaAsync, ErrorMessage } from '../../types/index.ts';
import { schemaIssue, schemaResult, stringify } from '../../utils/index.ts';
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
  message: ErrorMessage | undefined;
};

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
  message?: ErrorMessage
): EnumSchemaAsync<TEnum> {
  // Get values
  const values = Object.values(enum_);

  // Create and return enum schema
  return {
    type: 'enum',
    expects: values.map(stringify).join(' | '),
    async: true,
    enum: enum_,
    message,
    async _parse(input, config) {
      // If type is valid, return schema result
      if (values.includes(input as any)) {
        return schemaResult(true, input as TEnum[keyof TEnum]);
      }

      // Otherwise, return schema issue
      return schemaIssue(this, enumAsync, input, config);
    },
  };
}

/**
 * See {@link enumAsync}
 *
 * @deprecated Use `enumAsync` instead.
 */
export const nativeEnumAsync = enumAsync;
