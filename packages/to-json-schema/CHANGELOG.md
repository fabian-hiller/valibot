# Changelog

All notable changes to the library will be documented in this file.

## vX.X.X (Month DD, YYYY)

- Add support for `minEntries` and `maxEntries` action (pull request #1100)
- Change Valibot peer dependency to v1.1.0

## v1.0.0 (March 19, 2025)

- Add support for `exactOptional` and `undefinedable` schema
- Add support for `base64`, `isoTime`, `isoDateTime`, `nonEmpty` and `url` action (pull request #962)
- Add support for `bic`, `cuid2`, `empty`, `decimal`, `digits`, `emoji`, `hex_color`, `hexadecimal`, `nanoid`, `octal` and `ulid` action (pull request #998)
- Change Valibot peer dependency to v1.0.0
- Change extraction of default value from `nullable`, `nullish` and `optional` schema
- Change `force` to `errorMode` in config for better control (issue #889)
- Change `additionalProperties` for `object` and `looseObject` schema (pull request #1001)

## v0.2.1 (September 30, 2024)

- Fix type export for Deno (pull request #854)

## v0.2.0 (September 15, 2024)

- Add support for `title` action (discussion #826)

## v0.1.1 (September 14, 2024)

- Fix maximum call stack bug for recursive schemas
- Fix invalid JSON Schema ouput for recursive schemas

## v0.1.0 (September 13, 2024)

- Initial release
