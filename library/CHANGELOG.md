# Changelog

All notable changes to the library will be documented in this file.

## vX.X.X (Month DD, YYYY)

- Add `cuid2` validation (pull request #130)
- Add `passthrough`, `passthroughAsync`, `strip` and `stripAsync` method
- Add `InstanceSchemaAsync` overload to `transformAsync` method (pull request #138)
- Fix bug in `strict` and `strictAsync` method for optional keys (issue #131)

## v0.13.1 (August 23, 2023)

- Change object type check in `object` and `record` schema

## v0.13.0 (August 23, 2023)

> Note: The library has been revised and refactored. There is a migration guide in the [release notes](https://github.com/fabian-hiller/valibot/releases/tag/v0.13.0).

- Add `fallback` and `fallbackAsync` method (pull request #103)
- Add `excludes` validation as negation of `includes`
- Add support for more primitives to `literal` schema (pull request #102)
- Add support for dynamic values to `withDefault` method
- Change `flatten` method so that issues are also accepted as argument
- Change return type of `safeParse` and `safeParseAsync` method
- Change error handling and refactor library to improve performance
- Rename `.parse` to `._parse` and `.types` to `._types` to mark it as internal

## v0.12.0 (August 11, 2023)

- Change input type of `mimeType` validation to `Blob`
- Rename `useDefault` method to `withDefault` (issue #80)
- Add `brand` method to support branded types (pull request #85)

## v0.11.1 (August 07, 2023)

- Fix types of `enumType` and `enumTypeAsync` schema (issue #70)
- Improve performance of loops with for...of (pull request #68)

## v0.11.0 (August 06, 2023)

- Fix prototype pollution vulnerability of `record` and `recordAsync` (pull request #67)
- Add `finite`, `safeInteger` and `multipleOf` validation (pull request #64, #65, #66)

## v0.10.0 (August 05, 2023)

- Add `integer` validation (pull request #62)

## v0.9.0 (August 04, 2023)

- Add `imei` validation and `isLuhnAlgo` util (pull request #37)
- Fix `isoDateTime`, `isoTime`, `isoTimeSecond` and `isoTimestamp` validation (pull request #42)

## v0.8.0 (July 31, 2023)

- Fix infered `object` and `record` types (issue #9, #10, #34)
- Add `strict` and `strictAsync` method to detect unknown object keys

## v0.7.0 (July 30, 2023)

- Add `is` method which can be used as a type guard (pull request #13)
- Throw all validation issues of a pipeline by default (issue #18)
- Add `abortPipeEarly` option to abort pipe on first error (issue #18)
- Add `abortEarly` option to abort on first error

## v0.6.0 (July 30, 2023)

- Add `toMinValue` and `toMaxValue` transformation

## v0.5.0 (July 28, 2023)

- Fix invalid `comparable` import when using Deno
- Add util functions to exports of library
- Rename `minRange` and `maxRange` to `minValue` and `maxValue` (issue #20)
- Add `value` validation function

## v0.4.0 (July 27, 2023)

- Add `instance` and `instanceAsync` schema
- Refactor library to work with Deno

## v0.3.0 (July 27, 2023)

- Add `bytes`, `minBytes` and `maxBytes` validation (pull request #1)
- Change build step to tsup and exports in package.json (issue #7)

## v0.2.1 (July 26, 2023)

- Change order of exports in package.json (issue #7)

## v0.2.0 (July 25, 2023)

- Add `blob` and `blobAsync` schema

## v0.1.0 (July 12, 2023)

- Initial release
