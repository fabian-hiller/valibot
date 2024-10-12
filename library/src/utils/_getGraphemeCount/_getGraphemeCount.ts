let segmenter: Intl.Segmenter;

/**
 * Returns the grapheme count of the input.
 *
 * @param input The input to be measured.
 *
 * @returns The grapheme count.
 *
 * @internal
 */
export function _getGraphemeCount(input: string): number {
  if (!segmenter) {
    segmenter = new Intl.Segmenter();
  }
  const segments = segmenter.segment(input);
  let count = 0;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  for (const _ of segments) {
    count++;
  }
  return count;
}
