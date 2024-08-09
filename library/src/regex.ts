import { regex } from 'regex';

// Hint: The `regex` import declaration and use of the [regex](https://github.com/slevithan/regex)
// library (which extends JS regex syntax with key PCRE features that improve readability) are
// transpiled away.

/**
 * [Base64](https://en.wikipedia.org/wiki/Base64) regex.
 */
export const BASE64_REGEX: RegExp = regex('i')`
  ^ (\g<char>{4})* (\g<char>{2} == | \g<char>{3} =)? $

  (?(DEFINE) (?<char> [\da-z+\/]))
`;

/**
 * [BIC](https://en.wikipedia.org/wiki/ISO_9362) regex.
 */
export const BIC_REGEX: RegExp = regex`^
  [A-Z]{6}
  (?! 00) [\dA-Z]{2}
  ([\dA-Z]{3})?
$`;

/**
 * [Cuid2](https://github.com/paralleldrive/cuid2) regex.
 */
export const CUID2_REGEX: RegExp = /^[a-z][\da-z]*$/u;

/**
 * [Decimal](https://en.wikipedia.org/wiki/Decimal) regex.
 */
export const DECIMAL_REGEX: RegExp = /^\d+$/u;

/**
 * Email regex.
 */
export const EMAIL_REGEX: RegExp = regex('i')`
  ^
  \g<userChars> (\. \g<userChars>)*           # username
  @ \g<domainChars> ([.\-] \g<domainChars>)*  # @domain
  \. [a-z]{2,}                                # .TLD
  $

  (?(DEFINE)
    (?<userChars>   [\w+\-]+)
    (?<domainChars> [\da-z]+)
  )
`;

/**
 * Emoji regex from [emoji-regex-xs](https://github.com/slevithan/emoji-regex-xs) v1.0.0 (MIT license).
 *
 * Hint: We decided against the newer `/^\p{RGI_Emoji}+$/v` regex because it is
 * not supported in older runtimes and does not match all emoji.
 */
export const EMOJI_REGEX: RegExp =
  // eslint-disable-next-line redos-detector/no-unsafe-regex, regexp/no-dupe-disjunctions -- false positives
  /^(?:[\u{1F1E6}-\u{1F1FF}]{2}|\u{1F3F4}[\u{E0061}-\u{E007A}]{2}[\u{E0030}-\u{E0039}\u{E0061}-\u{E007A}]{1,3}\u{E007F}|(?:\p{Emoji}\uFE0F\u20E3?|\p{Emoji_Modifier_Base}\p{Emoji_Modifier}?|\p{Emoji_Presentation})(?:\u200D(?:\p{Emoji}\uFE0F\u20E3?|\p{Emoji_Modifier_Base}\p{Emoji_Modifier}?|\p{Emoji_Presentation}))*)+$/u;

/**
 * [Hexadecimal](https://en.wikipedia.org/wiki/Hexadecimal) regex.
 */
export const HEXADECIMAL_REGEX: RegExp = regex('i')`^ (0 [hx])? \p{AHex}+ $`;

/**
 * [Hex color](https://en.wikipedia.org/wiki/Web_colors#Hex_triplet) regex.
 */
export const HEX_COLOR_REGEX: RegExp = regex`^
  \# ( \p{AHex}{3,4}
     | \p{AHex}{6}
     | \p{AHex}{8}
     )
$`;

/**
 * [IMEI](https://en.wikipedia.org/wiki/International_Mobile_Equipment_Identity) regex.
 */
export const IMEI_REGEX: RegExp = regex`^ (\d{15} | \d{2}-\d{6}-\d{6}-\d) $`;

/**
 * [IPv4](https://en.wikipedia.org/wiki/IPv4) regex.
 */
export const IPV4_REGEX: RegExp = regex`
  ^ \g<ipv4> $

  (?(DEFINE)
    (?<ipv4> \g<byte> (\. \g<byte>){3})
    (?<byte> 25[0-5] | 2[0-4]\d | 1\d\d | [1-9]?\d)
  )
`;

/**
 * [IPv6](https://en.wikipedia.org/wiki/IPv6) regex.
 */
export const IPV6_REGEX: RegExp = regex('i')`
  ^ \g<ipv6> $

  (?(DEFINE)
    (?<ipv6>
      ( ( \g<part>{7}
        | :: \g<part>{0,6}
        | \g<part>    : \g<part>{0,5}
        | \g<part>{2} : \g<part>{0,4}
        | \g<part>{3} : \g<part>{0,3}
        | \g<part>{4} : \g<part>{0,2}
        | \g<part>{5} : \g<part>?
        )
        \g<segment>
      | ::
      # With zone identifier
      | fe80: (: \p{AHex}{0,4}){0,4} % [\da-z]+
      # Mixed addresses
      | :: (ffff (: 0{1,4})? :)? \g<ipv4>
      | \g<part>{1,4} : \g<ipv4>
      )
    )
    (?<part> \g<segment> :)
    (?<segment> \p{AHex}{1,4})
    (?<ipv4> \g<byte> (\. \g<byte>){3})
    (?<byte> 25[0-5] | 2[0-4]\d | 1\d\d | [1-9]?\d)
  )
`;

// Q: Would it be tree-shakeable if this used interpolation without adding any new variables, as
// ``new RegExp(`^(?:${IPV4_REGEX.source.slice(1, -1)}|${IPV6_REGEX.source.slice(1, -1)})$`, 'iu')``?
/**
 * [IP](https://en.wikipedia.org/wiki/IP_address) regex.
 */
export const IP_REGEX: RegExp = regex('i')`
  ^ (\g<ipv4> | \g<ipv6>) $

  (?(DEFINE)
    (?<ipv6>
      ( ( \g<part>{7}
        | :: \g<part>{0,6}
        | \g<part>    : \g<part>{0,5}
        | \g<part>{2} : \g<part>{0,4}
        | \g<part>{3} : \g<part>{0,3}
        | \g<part>{4} : \g<part>{0,2}
        | \g<part>{5} : \g<part>?
        )
        \g<segment>
      | ::
      # With zone identifier
      | fe80: (: \p{AHex}{0,4}){0,4} % [\da-z]+
      # Mixed addresses
      | :: (ffff (: 0{1,4})? :)? \g<ipv4>
      | \g<part>{1,4} : \g<ipv4>
      )
    )
    (?<part> \g<segment> :)
    (?<segment> \p{AHex}{1,4})
    (?<ipv4> \g<byte> (\. \g<byte>){3})
    (?<byte> 25[0-5] | 2[0-4]\d | 1\d\d | [1-9]?\d)
  )
`;

/**
 * [ISO 8601](https://en.wikipedia.org/wiki/ISO_8601) date regex.
 */
export const ISO_DATE_REGEX: RegExp =
  /^\d{4}-(?:0[1-9]|1[0-2])-(?:[12]\d|0[1-9]|3[01])$/u;

/**
 * [ISO 8601](https://en.wikipedia.org/wiki/ISO_8601) date-time regex.
 */
export const ISO_DATE_TIME_REGEX: RegExp =
  /^\d{4}-(?:0[1-9]|1[0-2])-(?:[12]\d|0[1-9]|3[01])T(?:0\d|1\d|2[0-3]):[0-5]\d$/u;

/**
 * [ISO 8601](https://en.wikipedia.org/wiki/ISO_8601) time regex.
 */
export const ISO_TIME_REGEX: RegExp = /^(?:0\d|1\d|2[0-3]):[0-5]\d$/u;

/**
 * [ISO 8601](https://en.wikipedia.org/wiki/ISO_8601) time with seconds regex.
 */
export const ISO_TIME_SECOND_REGEX: RegExp =
  /^(?:0\d|1\d|2[0-3])(?::[0-5]\d){2}$/u;

/**
 * [ISO 8601](https://en.wikipedia.org/wiki/ISO_8601) timestamp regex.
 */
export const ISO_TIMESTAMP_REGEX: RegExp =
  /^\d{4}-(?:0[1-9]|1[0-2])-(?:[12]\d|0[1-9]|3[01])T(?:0\d|1\d|2[0-3])(?::[0-5]\d){2}(?:\.\d{1,9})?(?:Z|[+-](?:0\d|1\d|2[0-3])(?::?[0-5]\d)?)$/u;

/**
 * [ISO 8601](https://en.wikipedia.org/wiki/ISO_8601) week regex.
 */
export const ISO_WEEK_REGEX: RegExp = /^\d{4}-W(?:0[1-9]|[1-4]\d|5[0-3])$/u;

/**
 * [MAC](https://en.wikipedia.org/wiki/MAC_address) 48 bit regex.
 */
export const MAC48_REGEX: RegExp =
  /^(?:[\da-f]{2}:){5}[\da-f]{2}$|^(?:[\da-f]{2}-){5}[\da-f]{2}$|^(?:[\da-f]{4}\.){2}[\da-f]{4}$/iu;

/**
 * [MAC](https://en.wikipedia.org/wiki/MAC_address) 64 bit regex.
 */
export const MAC64_REGEX: RegExp =
  /^(?:[\da-f]{2}:){7}[\da-f]{2}$|^(?:[\da-f]{2}-){7}[\da-f]{2}$|^(?:[\da-f]{4}\.){3}[\da-f]{4}$|^(?:[\da-f]{4}:){3}[\da-f]{4}$/iu;

/**
 * [MAC](https://en.wikipedia.org/wiki/MAC_address) regex.
 */
export const MAC_REGEX: RegExp =
  /^(?:[\da-f]{2}:){5}[\da-f]{2}$|^(?:[\da-f]{2}-){5}[\da-f]{2}$|^(?:[\da-f]{4}\.){2}[\da-f]{4}$|^(?:[\da-f]{2}:){7}[\da-f]{2}$|^(?:[\da-f]{2}-){7}[\da-f]{2}$|^(?:[\da-f]{4}\.){3}[\da-f]{4}$|^(?:[\da-f]{4}:){3}[\da-f]{4}$/iu;

/**
 * [Octal](https://en.wikipedia.org/wiki/Octal) regex.
 */
export const OCTAL_REGEX: RegExp = /^(?:0o)?[0-7]+$/iu;

/**
 * [ULID](https://github.com/ulid/spec) regex.
 */
export const ULID_REGEX: RegExp = /^[\da-hjkmnp-tv-z]{26}$/iu;

/**
 * [UUID](https://en.wikipedia.org/wiki/Universally_unique_identifier) regex.
 */
export const UUID_REGEX: RegExp =
  /^[\da-f]{8}(?:-[\da-f]{4}){3}-[\da-f]{12}$/iu;
