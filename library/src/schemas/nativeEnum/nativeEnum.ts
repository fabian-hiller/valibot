import type { BaseSchema, ErrorMessage } from '../../types.ts';
import { getSchemaIssues, getOutput } from '../../utils/index.ts';

/**
 * Native enum type.
 */
export type NativeEnum = {
  [key: string]: string | number;
  [key: number]: string;
};

/**
 * Native enum schema type.
 */
export type NativeEnumSchema<
  TNativeEnum extends NativeEnum,
  TOutput = TNativeEnum[keyof TNativeEnum]
> = BaseSchema<TNativeEnum[keyof TNativeEnum], TOutput> & {
  kind: 'native_enum';
  /**
   * The native enum value.
   */
  nativeEnum: TNativeEnum;
};

/**
 * Creates a enum schema.
 *
 * @param nativeEnum The native enum value.
 * @param error The error message.
 *
 * @returns A enum schema.
 */
export function nativeEnum<TNativeEnum extends NativeEnum>(
  nativeEnum: TNativeEnum,
  error?: ErrorMessage
): NativeEnumSchema<TNativeEnum> {
  return {
    kind: 'native_enum',
    async: false,
    nativeEnum,
    _parse(input, info) {
      // Check type of input
      if (!Object.values(nativeEnum).includes(input as any)) {
        return getSchemaIssues(
          info,
          'type',
          'native_enum',
          error || 'Invalid type',
          input
        );
      }

      // Return input as output
      return getOutput(input as TNativeEnum[keyof TNativeEnum]);
    },
  };
}
