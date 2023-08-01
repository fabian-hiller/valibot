import { i18next } from '../../i18n.ts';
import { ValiError } from '../../error/index.ts';
import type { BaseSchemaAsync } from '../../types.ts';

/**
 * Void schema async type.
 */
export type VoidSchemaAsync<TOutput = void> = BaseSchemaAsync<void, TOutput> & {
  schema: 'void';
};

/**
 * Creates an async void schema.
 *
 * @param error The error message.
 *
 * @returns An async void schema.
 */
export function voidTypeAsync(error?: string): VoidSchemaAsync {
  return {
    /**
     * The schema type.
     */
    schema: 'void',

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
    async parse(input, info) {
      // Check type of input
      if (typeof input !== 'undefined') {
        throw new ValiError([
          {
            reason: 'type',
            validation: 'void',
            origin: 'value',
            message: error || i18next.t("schemas.voidTypeAsync"),
            input,
            ...info,
          },
        ]);
      }

      // Return output
      return input;
    },
  };
}
