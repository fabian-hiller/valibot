import type { PipeResult } from '../../types.ts';
import { getOutput } from '../../utils/index.ts';

/**
 * Creates a async custom transformation function.
 *
 * @param action The transform action.
 *
 * @returns A async transformation function.
 */
export function toCustomAsync<TInput>(
  action: (input: TInput) => TInput | Promise<TInput>
) {
  return {
    kind: 'to_custom_async' as const,
    async _parse(input: TInput): Promise<PipeResult<TInput>> {
      return getOutput(await action(input));
    },
  };
}
