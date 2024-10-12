let store: Map<Intl.LocalesArgument, Intl.Segmenter>;

/**
 * Returns the word count of the input.
 *
 * @param locales The locales to be used.
 * @param input The input to be measured.
 *
 * @returns The word count.
 *
 * @internal
 */
export function _getWordCount(
  locales: Intl.LocalesArgument,
  input: string
): number {
  if (!store) {
    store = new Map();
  }
  if (!store.get(locales)) {
    store.set(locales, new Intl.Segmenter(locales, { granularity: 'word' }));
  }
  const segments = store.get(locales)!.segment(input);
  let count = 0;
  for (const segment of segments) {
    if (segment.isWordLike) {
      count++;
    }
  }
  return count;
}
