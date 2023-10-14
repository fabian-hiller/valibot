import type { BaseSchemaAsync, ErrorMessage } from '../../types.ts';
import { getSchemaIssues, getOutput } from '../../utils/index.ts';
import type { NativeEnum } from './nativeEnum.ts';

/**
 * Native enum schema async type.
 */
export type NativeEnumSchemaAsync<
  TNativeEnum extends NativeEnum,
  TOutput = TNativeEnum[keyof TNativeEnum]
> = BaseSchemaAsync<TNativeEnum[keyof TNativeEnum], TOutput> & {
  kind: 'native_enum';
  /**
   * The native enum value.
   */
  nativeEnum: TNativeEnum;
};

/**
 * Creates an async enum schema.
 *
 * @param nativeEnum The native enum value.
 * @param error The error message.
 *
 * @returns An async enum schema.
 */
export function nativeEnumAsync<TNativeEnum extends NativeEnum>(
  nativeEnum: TNativeEnum,
  error?: ErrorMessage
): NativeEnumSchemaAsync<TNativeEnum> {
  return {
    kind: 'native_enum',
    async: true,
    nativeEnum,
    async _parse(input, info) {
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
