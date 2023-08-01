import { i18next } from '../../i18n.ts';
import { ValiError } from '../../error/index.ts';
import type { BaseSchemaAsync } from '../../types.ts';

/**
 * Undefined schema async type.
 */
export type UndefinedSchemaAsync<TOutput = undefined> = BaseSchemaAsync<
  undefined,
  TOutput
> & {
  schema: 'undefined';
};

/**
 * Creates an async undefined schema.
 *
 * @param error The error message.
 *
 * @returns An async undefined schema.
 */
export function undefinedTypeAsync(error?: string): UndefinedSchemaAsync {
  return {
    /**
     * The schema type.
     */
    schema: 'undefined',

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
            validation: 'undefined',
            origin: 'value',
            message: error || i18next.t("schemas.undefinedTypeAsync"),
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
