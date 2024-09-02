# Valibot to JSON Schema

Utility to convert [Valibot](https://valibot.dev) schemas to JSON schema (draft 07).

```js
import { toJsonSchema } from '@valibot/to-json-schema';
import * as v from 'valibot';

toJsonSchema(v.string()); // { type: "string" }
```

Some Valibot features can't be mapped to JSON schema. For example, transformation actions have no equivalent in JSON schema. Also, some Valibot schemas or validations are too JS-specific and do not have an equivalent JSON schema attribute.

## Supported features

**Warning**: Converted schemas may behave slightly differently in JSON schema validators (especially for string format) because their implementation is different from Valibot's.

Here are the supported Valibot functions:

| Schema           | Status | Note                                                                |
|------------------| ----- |---------------------------------------------------------------------|
| `any`            | ✅    |                                                                     |
| `unknown`        | ✅    |                                                                     |
| `null`           | ✅    |                                                                     |
| `nullable`       | ✅    |                                                                     |
| `nullish`        | ✅    |                                                                     |
| `optional`       | ✅    |                                                                     |
| `boolean`        | ✅    |                                                                     |
| `number`         | ✅    |                                                                     |
| `string`         | ✅    |                                                                     |
| `literal`        | ✅    |                                                                     |
| `picklist`       | ✅    |                                                                     |
| `enum`           | ✅    |                                                                     |
| `union`          | ✅    |                                                                     |
| `variant`        | ⚠️    | Ignoring the key                                                    |
| `intersect`      | ✅    |                                                                     |
| `object`         | ✅    |                                                                     |
| `objectWithRest` | ✅    |                                                                     |
| `looseObject`    | ✅    |                                                                     |
| `strictObject`   | ✅    |                                                                     |
| `record`         | ⚠️    | Only with `string` key schema                                       |
| `tuple`          | ✅    |                                                                     |
| `tupleWithRest`  | ✅    |                                                                     |
| `looseTuple`     | ✅    |                                                                     |
| `strictTuple`    | ✅    |                                                                     |
| `array`          | ✅    |                                                                     |
| `lazy`           | ⚠️    | Only if the schema is referenced in the [definitions](#definitions) |

| Actions        | Status | Note                                          |
|----------------|--------|-----------------------------------------------|
| `description`  | ✅      |                                               |
| `email`        | ✅      |                                               |
| `isoDate`      | ✅      |                                               |
| `isoTimestamp` | ✅      |                                               |
| `ipv4`         | ✅      |                                               |
| `ipv6`         | ✅      |                                               |
| `uuid`         | ✅      |                                               |
| `regex`        | ⚠️     | RexExp flags are not supported in JSON schema |
| `integer`      | ✅      |                                               |
| `length`       | ✅      |                                               |
| `minLength`    | ✅      |                                               |
| `maxLength`    | ✅      |                                               |
| `value`        | ⚠️     | For `number`, `string` and `boolean` schemas  |
| `minValue`     | ⚠️     | For `number` schema                           |
| `maxValue`     | ⚠️     | For `number` schema                           |
| `multipleOf`   | ✅      |                                               |

## Options

| Option      | Type                                   | Note                                                                                          |
|-------------|----------------------------------------|-----------------------------------------------------------------------------------------------|
| force       | `boolean`                              | Force conversion on incompatible schema or action (see [force conversion](#force-conversion)) |
| definitions | `Record<string, Schema>`               | Named schema definitions (see [definitions](#definitions))                                    |
| definitionPath | `'$defs'` (default) \| `'definitions'` | JSON schema definition path to use (see [definitions](#definitions))                          |

### Force conversion

To force the conversion of unsupported Valibot features, you can provide the `force: true` option. Without this option, `toJsonSchema` will throw an error for unsupported features.

> Unsupported schemas will return an empty JSON schema (`{}`) and unsupported actions will be ignored.

Example:

```js
import { toJsonSchema } from '@valibot/to-json-schema';
import * as v from 'valibot';

toJsonSchema(v.blob(), { force: true }); // {} (empty schema)

toJsonSchema(v.pipe(v.string(), v.mac64()), { force: true }); // { type: "string" } (ignoring mac64 validation)
```

### Definitions

Nested schemas can be broken in multiple named definitions (`definitions` option).

Example definitions:

```js
import { toJsonSchema } from '@valibot/to-json-schema';
import * as v from 'valibot';

const aNumber = v.number();
const aString = v.string();
toJsonSchema(
    aNumber,
    { definitions: { aNumber, aString } }
); 
// { 
//    $ref: '#/$defs/aNumber', 
//    $defs: { 
//      aNumber: { type: 'number' }, 
//      aString: { type: 'string' }
//    }
// }
```

> The default JSON schema definitions path used is `$defs` but it can be customized with the option `definitionPath`.

Definitions **are required when converting `lazy` schema** to provide the definition name.

Example lazy with definitions:

```js
import { toJsonSchema } from '@valibot/to-json-schema';
import * as v from 'valibot';

const aNumber = v.number();
const numberTree = v.record(v.string(), v.union([v.lazy(() => aNumber), v.lazy(() => numberTree)]));
toJsonSchema(
    numberTree,
    { definitions: { aNumber, numberTree } }
);
// {
//    $ref: '#/$defs/numberTree', 
//    $defs: { 
//      aNumber: { type: 'number' }, 
//      numberTree: { 
//        type: 'object', 
//        additionalProperties: {
//          anyOf: [{ $ref: '#/$defs/aNumber' }, { $ref: '#/$defs/numberTree' }]
//        } 
//    }
// }
```
