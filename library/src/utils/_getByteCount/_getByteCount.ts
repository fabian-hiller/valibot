let textEncoder: TextEncoder;

/**
 * Returns the byte count of the input.
 *
 * @param input The input to be measured.
 *
 * @returns The byte count.
 *
 * @internal
 */
export function _getByteCount(input: string): number {
  if (!textEncoder) {
    textEncoder = new TextEncoder();
  }
  return textEncoder.encode(input).length;
}
