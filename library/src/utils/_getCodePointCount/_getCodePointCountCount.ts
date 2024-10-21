/**
 * Returns the code point count of the input.
 *
 * @param input The input to be measured.
 *
 * @returns The code point count.
 *
 * @internal
 */
export function _getCodePointCount(input: string): number {
  let count = 0;
  for (let i = 0; i < input.length; count++) {
    // If codePoint were undefined here, we would have already got out of loop
    if (input.codePointAt(i)! <= 65535) {
      i++;
    } else {
      i += 2; // 2 characters (surrogate pair) in JS (UTF-16)
    }
  }
  return count;
}
