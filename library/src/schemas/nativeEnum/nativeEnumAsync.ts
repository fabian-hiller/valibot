import type { BaseSchemaAsync } from '../../types.ts';
import { getIssues } from '../../utils/index.ts';
import type { NativeEnum } from './nativeEnum.ts';

/**
 * Native enum schema async type.
 */
export type NativeEnumSchemaAsync<
  TNativeEnum extends NativeEnum,
  TOutput = TNativeEnum[keyof TNativeEnum]
> = BaseSchemaAsync<TNativeEnum[keyof TNativeEnum], TOutput> & {
  schema: 'native_enum';
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
  error?: string
): NativeEnumSchemaAsync<TNativeEnum> {
  return {
    /**
     * The schema type.
     */
    schema: 'native_enum',

    /**
     * The native enum value.
     */
    nativeEnum,

    /**
     * Whether it's async.
     */
    async: true,

    /**
     * Parses unknown input based on its schema.
     *
     * @param input The input to be parsed.
     * @param info The parse info.
     *
     * @returns The parsed output.
     */
    async _parse(input, info) {
      // Check type of input
      if (!Object.values(nativeEnum).includes(input as any)) {
        return getIssues(
          info,
          'type',
          'native_enum',
          error || 'Invalid type',
          input
        );
      }

      // Return input as output
      return { output: input as TNativeEnum[keyof TNativeEnum] };
    },
  };
}
