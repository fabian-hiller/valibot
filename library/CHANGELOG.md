# Changelog

All notable changes to the library will be documented in this file.

## vX.X.X (Month DD, YYYY)

- Fix bug in `getDefaults`, `getDefaultsAsync`, `getFallbacks` and `getFallbacksAsync` for falsy but not `undefined` values (issue #356)

## v0.25.0 (December 26, 2023)

- Add `creditCard`, `decimal`, `hash`, `hexadecimal`, `hexColor` and `octal` pipeline validation action (pull request #292, #304, #307, #308, #309)
- Add `pipe` parameter to `intersect`, `intersectAsync`, `union`, `unionAsync`, `variant` and `variantAsync` schema (discussion #297)
- Add support for multiple variant options with same discriminator key to `variant` and `variantAsync` schema (issue #310)
- Add path to issues if discriminator key of `variant` and `variantAsync` schema is missing (issue #235, #303)
- Change `PicklistOptions` type and generics of `picklist` and `picklistAsync` schema

## v0.24.1 (December 11, 2023)

- Fix output type of optional `object` and `objectAsync` entries with default value (issue #286)
- Fix output type of `nullable`, `nullableAsync`, `nullish`, `nullishAsync`, `optional` and `optionalAsync` schema with default value (issue #286)

## v0.24.0 (December 10, 2023)

- Add support for `special` schema as key of `record` schema (issue #291)
- Add support for `special` and `specialAsync` schema as key of `recordAsync` schema (issue #291)
- Fix input and output type of optional `object` and `objectAsync` entries with default value (issue #286)

## v0.23.0 (December 08, 2023)

- Add `bic` validation function (pull request #284)
- Add `mac`, `mac48` and `mac64` validation function (pull request #270)
- Change `PicklistOptions`, `UnionOptions` and `UnionOptionsAsync` type from tuple to array (issue #279)
- Change `IntersectOptions`, `IntersectOptionsAsync`, `UnionOptions` and `UnionOptionsAsync` type to support readonly values (issue #279)
- Fix optional keys of `ObjectInput` and `ObjectOutput` type (issue #242)

## v0.22.0 (December 03, 2023)

- Add support for boolean to `notValue` validation (pull request #261)
- Add `.typed` to schema validation result and execute pipeline of complex schemas if output is typed (issue #76, #145)
- Add `forward` method that forwards issues of pipelines to nested fields (issue #76, #145)
- Add `skipPipe` option to `is` type guard method (pull request #166)
- Change return type of `safeParse` and `safeParseAsync` method
- Rename and change util functions and refactor codebase
- Fix `RecordInput` and `RecordOuput` type when using `unionAsync` as key
- Fix output type for `nullable`, `nullableAsync`, `nullish`, `nullishAsync`, `optional` and `optionalAsync` when using a default value (issue #271)

## v0.21.0 (November 19, 2023)

- Change structure of schemas, validations and transformations to make properties accessible (pull request #211)
- Fix errors in JSDoc comments and add JSDoc ESLint plugin (pull request #205)
- Fix missing file extension for Deno (pull request #249)

## v0.20.1 (November 2, 2023)

- Remove `never` from type signatur of strict objects and tuples (issue #234)

## v0.20.0 (October 31, 2023)

> Note: The library has been revised and refactored. There is a migration guide in the [release notes](https://github.com/fabian-hiller/valibot/releases/tag/v0.20.0).

- Add `getRestAndDefaultArgs` utility function
- Add `rest` argument to `object` and `objectAsync` schema
- Add `variant` and `variantAsync` schema (issue #90, #216)
- Add `getFallback` property to schema in `fallback` method (pull request #177)
- Add `PartialObjectEntries` and `PartialObjectEntriesAsync` type (issue #217)
- Add export for any validation regex (pull request #219)
- Add `getDefaultAsync`, `getDefaults` and `getDefaultsAsync`, `getFallback`, `getFallbackAsync`, `getFallbacks`, `getFallbacksAsync` method (issue #155)
- Add support for schema validation to `transform` and `transformAsync`
- Fix type check in `date` and `dateAsync` for invalid dates (pull request #214)
- Improve security of regular expressions (pull request #202)
- Improve `optional`, `optionalAsync`, `nullable`, `nullableAsync`, `nullish` and `nullishAsync` schema
- Change `ObjectSchema` and `ObjectSchemaAsync` type
- Change type check in `tuple` and `tupleAsync` to be less strict
- Change return type of `action` argument in `coerce` and `coerceAsync` to `unknown`
- Change type of `brand`, `getDefault`, `transform` and `transformAsync` method
- Change type of `array`, `arrayAsync`, `intersection`, `intersectionAsync`, `map`, `mapAsync`, `object`, `objectAsync`, `union`, `unionAsync`, `record`, `recordAsync`, `set`, `setAsync`, `tuple` and `tupleAsync` schema
- Rename `schema` property of every schema type to `type`
- Rename `intersection` and `intersectionAsync` schema to `intersect` and `intersectAsync`
- Rename `enumType` and `enumTypeAsync` schema to `picklist` and `picklistAsync`
- Rename `nativeEnum` and `nativeEnumAsync` schema to `enum_` and `enumAsync`
- Rename `nullType` and `nullTypeAsync` schema to `null_` and `nullAsync`
- Rename `undefinedType` and `undefinedTypeAsync` schema to `undefined_` and `undefinedAsync`
- Rename `voidType` and `voidTypeAsync` schema to `void_` and `voidAsync`
- Rename `default` property of `optional`, `optionalAsync`, `nullable`, `nullableAsync`, `nullish` and `nullishAsync` schema to `getDefault`
- Rename `ObjectShape` and `ObjectShapeAsync` types to `ObjectEntries` and `ObjectEntriesAsync`
- Rename `TupleShape` and `TupleShapeAsync` types to `TupleItems` and `TupleItemsAsync`
- Deprecate `passthrough`, `strict` and `strip` method in favor of `object` schema with `rest` argument

## v0.19.0 (October 08, 2023)

- Add `notBytes`, `notLength`, `notSize` and `notValue` validation function (pull request #194)
- Add support for unions as key of `record` and `recordAsync` schema (issue #201)
- Add support for pipeline validation to `transform` and `transformAsync` (issue #197)
- Change regex of `email` validation to improve performance and security (pull request #180)
- Change `object` and `objectAsync` schema to exclude non-existing keys (issue #199)
- Fix types at `brand`, `transform` and `unwrap` method (issue #195)
- Deprecate `equal` validation function in favor of `value` (issue #192)

## v0.18.0 (September 30, 2023)

- Add `intersection` and `intersectionAsync` schema (pull request #117)
- Fix `RecordInput` and `RecordOutput` type (pull request #184)
- Change `RecordSchema` and `RecordSchemaAsync` type
- Change `flatten` function and improve types

## v0.17.1 (September 25, 2023)

- Fix missing file extensions for Deno (pull request #178, #181)

## v0.17.0 (September 17, 2023)

- Add support for multiple branding of a value (pull request #88)
- Add support for dynamic error messages via functions (pull request #136)
- Add `skipPipe` option to skip execution of pipelines (pull request #164)

## v0.16.0 (September 16, 2023)

- Add `ulid` validation (pull request #151)
- Add `getIssues`, `getOutput` and `getPipeIssues` util and refactor code
- Fix type check in `number` and `numberAsync` schema (issue #157)
- Change `PipeResult` type to allow multiple issues (issue #161)
- Rename previous `getIssues` util to `getSchemaIssues`

## v0.15.0 (September 10, 2023)

- Add possibility to define path of pipeline issue (issue #5)
- Add `getDefault` method to get default value of schema (issue #105)
- Add support for enums as key of `record` and `recordAsync` schema (issue #134)
- Add support for default values to `optional`, `optionalAsync`, `nullable`, `nullableAsync`, `nullish` and `nullishAsync` schema (issue #96, #118)
- Deprecate `withDefault` method in favor of `optional` schema

## v0.14.0 (September 08, 2023)

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
- Change `flatten` function so that issues are also accepted as argument
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
