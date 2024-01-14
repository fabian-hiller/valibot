/**
 *
 * @param ip a string representing the IP address
 *
 * @returns boolean true, if is valid address, false otherwise
 */
export function isIPv6(ip: string): boolean {
  if (ip === '') return false;

  const segments = ip.split(':');
  const emptySegmentCount = segments.filter((s) => s === '').length;

  // A valid IPv6 should not have more than one empty segment (for '::') and not more than 8 total segments
  if (
    emptySegmentCount > 1 ||
    segments.length > 8 ||
    (emptySegmentCount === 0 && segments.length !== 8)
  ) {
    return false;
  }

  // Validate each non-empty segment
  return segments.every(
    (segment) =>
      segment === '' ||
      (segment.length <= 4 && /^[A-F\d]{1,4}$/iu.test(segment))
  );
}
