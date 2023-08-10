# Changelog

All notable changes to the library will be documented in this file.

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
