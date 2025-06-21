const separators: Set<string> = new Set<string>([
  '', // represents all whitespaces (trim the character before performing the membership check)
  '_',
  '-',
  '.',
]);

const isSeparator = (ch: string): boolean => separators.has(ch.trim());

const isUpperCase = (ch: string): boolean =>
  ch === ch.toUpperCase() && ch !== ch.toLowerCase();

/**
 * Converts a string to camel case.
 *
 * @param input The string to be converted.
 *
 * @returns The camel case of the input.
 */
export function camelCase(input: string): string {
  const chs: string[] = [];
  // convert the input to space separated characters
  // example: "__a--b  c" -> ["a", " ", "b", " ", "c"]
  for (const ch of input) {
    if (!isSeparator(ch)) {
      chs.push(ch);
      continue;
    }
    if (chs.length > 0 && chs[chs.length - 1] !== ' ') {
      chs.push(' ');
    }
  }
  if (chs.at(-1) === ' ') {
    chs.pop();
  }
  // convert space separated characters to camel case
  const res: string[] = [];
  let chIdx = 0;
  while (chIdx < chs.length) {
    const ch = chs[chIdx++];
    res.push(res.length === 0 ? ch.toLowerCase() : ch.toUpperCase());
    let wasPrevUpperCase = isUpperCase(ch);
    while (chIdx < chs.length && chs[chIdx] !== ' ') {
      const ch = chs[chIdx++];
      res.push(wasPrevUpperCase ? ch.toLowerCase() : ch);
      wasPrevUpperCase = isUpperCase(ch);
    }
    chIdx += 1;
  }
  return res.join('');
}
