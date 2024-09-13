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
| `unknown`        | ✅     |                                                                     |
| `variant`        | ⚠️     | The discriminator key will be ignored                               |

| Actions        | Status | Note                                                  |
| -------------- | ------ | ----------------------------------------------------- |
| `description`  | ✅     |                                                       |
| `email`        | ✅     |                                                       |
| `integer`      | ✅     |                                                       |
| `ipv4`         | ✅     |                                                       |
| `ipv6`         | ✅     |                                                       |
| `isoDate`      | ✅     |                                                       |
| `isoTimestamp` | ✅     |                                                       |
| `length`       | ⚠️     | Only in combination with `string` and `array` schema  |
| `maxLength`    | ⚠️     | Only in combination with `string` and `array` schema  |
| `maxValue`     | ⚠️     | Only in combination with `number` schema              |
| `minLength`    | ⚠️     | Only in combination with `string` and `array` schemas |
| `minValue`     | ⚠️     | Only in combination with `number` schema              |
| `multipleOf`   | ✅     |                                                       |
| `regex`        | ⚠️     | RexExp flags are not supported in JSON schema         |
| `uuid`         | ✅     |                                                       |
| `value`        | ✅     |                                                       |

## Configurations

| Option      | Type                            | Note                                                                                                                      |
| ----------- | ------------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| force       | `boolean`                       | Whether to force conversion to JSON Schema even for incompatible schemas and actions.                                     |
| definitions | `Record<string, GenericSchema>` | The schema definitions for constructing recursive schemas. If not specified, the definitions are generated automatically. |

### Force conversion

To force the conversion of unsupported Valibot features, you can provide the `force: true` configuration. Without it, `toJsonSchema` will throw an error for unsupported features.

> Unsupported schemas usually return an empty JSON schema (`{}`) and unsupported actions are usually ignored.

```js
import { toJsonSchema } from '@valibot/to-json-schema';
import * as v from 'valibot';

toJsonSchema(v.file(), { force: true }); // {}

toJsonSchema(v.pipe(v.string(), v.creditCard()), { force: true }); // { type: "string" }
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
