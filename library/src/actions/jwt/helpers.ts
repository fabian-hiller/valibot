/**
 * Converts base64Url encoded string to base64.
 *
 * @param base64UrlEncoded The base64Url encoded string.
 *
 * @returns The base64 encoded string.
 */
export function base64UrlToBase64(base64UrlEncoded: string): string {
  // https://stackoverflow.com/questions/55389211/string-based-data-encoding-base64-vs-base64url
  const res: Array<string> = [];
  for (const ch of base64UrlEncoded) {
    res.push(ch === '-' ? '+' : ch === '_' ? '/' : ch);
  }
  while (res.length % 4 !== 0) {
    res.push('=');
  }
  return res.join('');
}

/**
 * Decodes a base64 encoded string.
 *
 * @param base64Encoded The base64 encoded string.
 *
 * @returns The base64 decoded string.
 */
export function base64Decode(base64Encoded: string): string {
  // https://stackoverflow.com/questions/30106476/using-javascripts-atob-to-decode-base64-doesnt-properly-decode-utf-8-strings/77383580#77383580
  return new TextDecoder().decode(
    Uint8Array.from(atob(base64Encoded), (m) => m.charCodeAt(0))
  );
}

/**
 * Converts a string to a valid JSON value.
 *
 * @param data The string to convert.
 *
 * @returns A valid JSON value or `undefined` if the string is not a valid JSON value.
 */
export function JSONSafeParse(data: string): unknown {
  try {
    return JSON.parse(data);
  } catch {
    return undefined;
  }
}
