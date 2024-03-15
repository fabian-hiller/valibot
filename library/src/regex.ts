/**
 * [BIC] (https://en.wikipedia.org/wiki/ISO_9362) regex.
 */
export const BIC_REGEX = /^[A-Z]{6}(?!00)[A-Z\d]{2}(?:[A-Z\d]{3})?$/u;

/**
 * [Cuid2](https://github.com/paralleldrive/cuid2) regex.
 */
export const CUID2_REGEX = /^[a-z][\da-z]*$/u;

/**
 * [Decimal](https://en.wikipedia.org/wiki/Decimal) regex.
 */
export const DECIMAL_REGEX = /^\d+$/u;

/**
 * Email regex.
 */
export const EMAIL_REGEX =
  /^[\w+-]+(?:\.[\w+-]+)*@[\da-z]+(?:[.-][\da-z]+)*\.[a-z]{2,}$/iu;

/**
 * Emoji regex.
 */
export const EMOJI_REGEX = /^[\p{Extended_Pictographic}\p{Emoji_Component}]+$/u;

/**
 * [Hexadecimal](https://en.wikipedia.org/wiki/Hexadecimal) regex.
 */
export const HEXADECIMAL_REGEX = /^(0h|0x)?[\da-f]+$/iu;

/**
 * [Hex color](https://en.wikipedia.org/wiki/Web_colors#Hex_triplet) regex.
 */
export const HEX_COLOR_REGEX =
  /^#([\da-f]{3}|[\da-f]{4}|[\da-f]{6}|[\da-f]{8})$/iu;

/**
 * [IMEI](https://en.wikipedia.org/wiki/International_Mobile_Equipment_Identity) regex.
 */
export const IMEI_REGEX = /^\d{2}(?:[ /|-]?\d{6}){2}[ /|-]?\d$/u;

/**
 * [IPv4](https://en.wikipedia.org/wiki/IPv4) regex.
 */
export const IPV4_REGEX =
  // eslint-disable-next-line redos-detector/no-unsafe-regex -- false positive
  /^(?:(?:[1-9]|1\d|2[0-4])?\d|25[0-5])(?:\.(?:(?:[1-9]|1\d|2[0-4])?\d|25[0-5])){3}$/u;

/**
 * [IPv6](https://en.wikipedia.org/wiki/IPv6) regex.
 */
export const IPV6_REGEX =
  /^(?:(?:[\da-f]{1,4}:){7}[\da-f]{1,4}|(?:[\da-f]{1,4}:){1,7}:|(?:[\da-f]{1,4}:){1,6}:[\da-f]{1,4}|(?:[\da-f]{1,4}:){1,5}(?::[\da-f]{1,4}){1,2}|(?:[\da-f]{1,4}:){1,4}(?::[\da-f]{1,4}){1,3}|(?:[\da-f]{1,4}:){1,3}(?::[\da-f]{1,4}){1,4}|(?:[\da-f]{1,4}:){1,2}(?::[\da-f]{1,4}){1,5}|[\da-f]{1,4}:(?::[\da-f]{1,4}){1,6}|:(?:(?::[\da-f]{1,4}){1,7}|:)|fe80:(?::[\da-f]{0,4}){0,4}%[\da-z]+|::(?:f{4}(?::0{1,4})?:)?(?:(?:25[0-5]|(?:2[0-4]|1?\d)?\d)\.){3}(?:25[0-5]|(?:2[0-4]|1?\d)?\d)|(?:[\da-f]{1,4}:){1,4}:(?:(?:25[0-5]|(?:2[0-4]|1?\d)?\d)\.){3}(?:25[0-5]|(?:2[0-4]|1?\d)?\d))$/iu;

/**
 * [ISO 8601](https://en.wikipedia.org/wiki/ISO_8601) date regex.
 */
export const ISO_DATE_REGEX =
  /^\d{4}-(?:0[1-9]|1[0-2])-(?:[12]\d|0[1-9]|3[01])$/u;

/**
 * [ISO 8601](https://en.wikipedia.org/wiki/ISO_8601) date-time regex.
 */
export const ISO_DATE_TIME_REGEX =
  /^\d{4}-(?:0[1-9]|1[0-2])-(?:[12]\d|0[1-9]|3[01])T(?:0\d|1\d|2[0-3]):[0-5]\d$/u;

/**
 * [ISO 8601](https://en.wikipedia.org/wiki/ISO_8601) time regex.
 */
export const ISO_TIME_REGEX = /^(?:0\d|1\d|2[0-3]):[0-5]\d$/u;

/**
 * [ISO 8601](https://en.wikipedia.org/wiki/ISO_8601) time with seconds regex.
 */
export const ISO_TIME_SECOND_REGEX = /^(?:0\d|1\d|2[0-3])(?::[0-5]\d){2}$/u;

/**
 * [ISO 8601](https://en.wikipedia.org/wiki/ISO_8601) timestamp regex.
 */
export const ISO_TIMESTAMP_REGEX =
  /^\d{4}-(?:0[1-9]|1[0-2])-(?:[12]\d|0[1-9]|3[01])T(?:0\d|1\d|2[0-3])(?::[0-5]\d){2}(?:\.\d{1,9})?Z$/u;

/**
 * [ISO 8601](https://en.wikipedia.org/wiki/ISO_8601) week regex.
 */
export const ISO_WEEK_REGEX = /^\d{4}-W(?:0[1-9]|[1-4]\d|5[0-3])$/u;

/**
 * [MAC](https://en.wikipedia.org/wiki/MAC_address) 48 bit regex.
 */
export const MAC48_REGEX =
  /^(?:[\da-f]{2}:){5}[\da-f]{2}$|^(?:[\da-f]{2}-){5}[\da-f]{2}$|^(?:[\da-f]{4}\.){2}[\da-f]{4}$/iu;

/**
 * [MAC](https://en.wikipedia.org/wiki/MAC_address) 64 bit regex.
 */
export const MAC64_REGEX =
  /^(?:[\da-f]{2}:){7}[\da-f]{2}$|^(?:[\da-f]{2}-){7}[\da-f]{2}$|^(?:[\da-f]{4}\.){3}[\da-f]{4}$|^(?:[\da-f]{4}:){3}[\da-f]{4}$/iu;

/**
 * [Octal](https://en.wikipedia.org/wiki/Octal) regex.
 */
export const OCTAL_REGEX = /^(0o)?[0-7]+$/iu;

/**
 * [ULID](https://github.com/ulid/spec) regex.
 */
export const ULID_REGEX = /^[\da-hjkmnp-tv-z]{26}$/iu;

/**
 * [UUID](https://en.wikipedia.org/wiki/Universally_unique_identifier) regex.
 */
export const UUID_REGEX = /^[\da-f]{8}(?:-[\da-f]{4}){3}-[\da-f]{12}$/iu;
