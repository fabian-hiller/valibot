import type { PipeAsync, ValidateInfo } from '../../types';

/**
 * Executes the async validation and transformation pipe.
 *
 * @param input The input value.
 * @param pipe The pipe to be executed.
 * @param info The validation info.
 *
 * @returns The output value.
 */
export async function executePipeAsync<TValue>(
  input: TValue,
  pipe: PipeAsync<TValue>,
  info: ValidateInfo
): Promise<TValue> {
  return pipe.reduce<Promise<TValue>>(
    async (value, action) => action(await value, info),
    Promise.resolve(input)
  );
}
