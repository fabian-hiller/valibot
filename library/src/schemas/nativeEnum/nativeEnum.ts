import type { BaseSchema } from '../../types.ts';
import { getIssue } from '../../utils/index.ts';

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
  schema: 'native_enum';
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
  error?: string
): NativeEnumSchema<TNativeEnum> {
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
    async: false,

    /**
     * Parses unknown input based on its schema.
     *
     * @param input The input to be parsed.
     * @param info The parse info.
     *
     * @returns The parsed output.
     */
    _parse(input, info) {
      // Check type of input
      if (!Object.values(nativeEnum).includes(input as any)) {
        return {
          issues: [
            getIssue(info, {
              reason: 'type',
              validation: 'native_enum',
              message: error || 'Invalid type',
              input,
            }),
          ],
        };
      }

      // Return input as output
      return { output: input as TNativeEnum[keyof TNativeEnum] };
    },
  };
}
