# Valibot to JSON Schema

Utility to convert [Valibot](https://valibot.dev) schemas to JSON schema (draft 07).

```js
import { toJsonSchema } from '@valibot/to-json-schema';
import * as v from 'valibot';

toJsonSchema(v.string()); // { type: "string" }
```

Some Valibot features can't be mapped to JSON schema. For example, transformation actions have no equivalent in JSON schema. Also, some Valibot schemas or validations are too JS-specific and do not have an equivalent JSON schema attribute.

## Supported features

**Note**: Converted schemas may behave slightly differently in JSON schema validators (especially for string format) because their implementation is different from Valibot's.

| Schema           | Status | Note                                                                |
| ---------------- | ------ | ------------------------------------------------------------------- |
| `any`            | ✅     |                                                                     |
| `array`          | ✅     |                                                                     |
| `boolean`        | ✅     |                                                                     |
| `enum`           | ✅     |                                                                     |
| `exactOptional`  | ✅     |                                                                     |
| `intersect`      | ✅     |                                                                     |
| `lazy`           | ⚠️     | The `.getter`function is always executed with `undefined` as input  |
| `literal`        | ⚠️     | Only JSON compatible values are supported                           |
| `looseObject`    | ✅     |                                                                     |
| `looseTuple`     | ✅     |                                                                     |
| `null`           | ✅     |                                                                     |
| `nullable`       | ✅     |                                                                     |
| `nullish`        | ✅     |                                                                     |
| `number`         | ✅     |                                                                     |
| `objectWithRest` | ✅     |                                                                     |
| `object`         | ✅     |                                                                     |
| `optional`       | ✅     |                                                                     |
| `picklist`       | ⚠️     | Only JSON compatible values are supported                           |
| `record`         | ⚠️     | Only plain `string` schemas for the key of the record are supported |
| `strictObject`   | ✅     |                                                                     |
| `strictTuple`    | ✅     |                                                                     |
| `string`         | ✅     |                                                                     |
| `tupleWithRest`  | ✅     |                                                                     |
| `tuple`          | ✅     |                                                                     |
| `union`          | ✅     |                                                                     |
| `undefinedable`  | ✅     |                                                                     |
| `unknown`        | ✅     |                                                                     |
| `variant`        | ⚠️     | The discriminator key will be ignored                               |

| Actions        | Status | Note                                                        |
| -------------- | ------ | ----------------------------------------------------------- |
| `base64`       | ✅     |                                                             |
| `bic`          | ✅     |                                                             |
| `description`  | ✅     |                                                             |
| `cuid2`        | ✅     |                                                             |
| `email`        | ✅     |                                                             |
| `emoji`        | ✅     |                                                             |
| `empty`        | ✅     |                                                             |
| `entries`      | ✅     |                                                             |
| `decimal`      | ✅     |                                                             |
| `digits`       | ✅     |                                                             |
| `hexadecimal`  | ✅     |                                                             |
| `hexColor`     | ✅     |                                                             |
| `integer`      | ✅     |                                                             |
| `ipv4`         | ✅     |                                                             |
| `ipv6`         | ✅     |                                                             |
| `isoDate`      | ✅     |                                                             |
| `isoDateTime`  | ✅     |                                                             |
| `isoTime`      | ✅     |                                                             |
| `isoTimestamp` | ✅     |                                                             |
| `length`       | ⚠️     | Only in combination with `string` and `array` schema        |
| `metadata`     | ⚠️     | Only for valid `title`, `description` and `examples` values |
| `maxEntries`   | ✅     |                                                             |
| `maxLength`    | ⚠️     | Only in combination with `string` and `array` schema        |
| `maxValue`     | ⚠️     | Only in combination with `number` schema                    |
| `minEntries`   | ✅     |                                                             |
| `minLength`    | ⚠️     | Only in combination with `string` and `array` schemas       |
| `minValue`     | ⚠️     | Only in combination with `number` schema                    |
| `multipleOf`   | ✅     |                                                             |
| `nanoid`       | ✅     |                                                             |
| `nonEmpty`     | ✅     |                                                             |
| `octal`        | ✅     |                                                             |
| `regex`        | ⚠️     | RexExp flags are not supported in JSON schema               |
| `title`        | ✅     |                                                             |
| `ulid`         | ✅     |                                                             |
| `url`          | ✅     |                                                             |
| `uuid`         | ✅     |                                                             |
| `value`        | ✅     |                                                             |

## Configurations

| Option      | Type                            | Note                                                                                                                      |
| ----------- | ------------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| errorMode   | `'throw' \| 'warn' \| 'ignore'` | The policy for handling incompatible schemas and actions.                                                                 |
| definitions | `Record<string, GenericSchema>` | The schema definitions for constructing recursive schemas. If not specified, the definitions are generated automatically. |

### Error mode

The `errorMode` configuration controls how the converter handles unsupported schemas and actions. By default, the error mode is set to `'throw'`. To force the conversion of unsupported Valibot features, you can set it to `'ignore'`.

> Unsupported schemas usually return an empty JSON schema (`{}`) and unsupported actions are usually ignored.

```js
import { toJsonSchema } from '@valibot/to-json-schema';
import * as v from 'valibot';

toJsonSchema(v.file(), { errorMode: 'ignore' }); // {}

toJsonSchema(v.pipe(v.string(), v.creditCard()), { errorMode: 'ignore' }); // { type: "string" }
```

### Definitions

Nested schemas can be broken in multiple named definitions.

```js
import { toJsonSchema } from '@valibot/to-json-schema';
import * as v from 'valibot';

const EmailSchema = v.pipe(v.string(), v.email());
toJsonSchema(v.object({ email: EmailSchema }), {
  definitions: { EmailSchema },
});

/*
{
  $schema: "http://json-schema.org/draft-07/schema#",
  type: "object",
  properties: {
    email: {
      $ref: "#/$defs/EmailSchema",
    },
  },
  required: ["email"],
  additionalProperties: false,
  $defs: {
    EmailSchema: {
      type: "string",
      format: "email",
    },
  },
}
*/
```

Definitions are not required for converting `lazy` schemas. Missing definitions will be generated automatically.

```js
import { toJsonSchema } from '@valibot/to-json-schema';
import * as v from 'valibot';

const StringSchema = v.string();
toJsonSchema(v.object({ key: v.lazy(() => StringSchema) }));

/*
{
  $schema: "http://json-schema.org/draft-07/schema#",
  type: "object",
  properties: {
    key: {
      $ref: "#/$defs/0",
    },
  },
  required: ["key"],
  additionalProperties: false,
  $defs: {
    "0": {
      type: "string",
    },
  },
}
*/
```
