/**
 *
 * @param input The input to be measured
 *
 * @returns The grapheme count of the input
 *
 * @internal
 */
export function _getGraphemes(input: string): number {
  const segmenter = new Intl.Segmenter('en', { granularity: 'grapheme' });

  const segments = segmenter.segment(input);

  let count = 0;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  for (const _segment of segments) {
    count++;
  }

  return count;
}
