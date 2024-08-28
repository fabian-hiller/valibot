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

| Schema   | Status | Note |
| -------- | ------ | ---- |
| `any`    | ✅     |      |
| `null`   | ✅     |      |
| `string` | ✅     |      |
| `object` | ✅     |      |

| Actions | Status | Note |
| ------- | ------ | ---- |
| `email` | ✅     |      |

## Options

### Force conversion

To force the conversion of unsupported Valibot features, you can provide the `force: true` option. Without this option, `toJsonSchema` will throw an error for unsupported features.

> Unsupported schemas will return an empty JSON schema (`{}`) and unsupported actions will be ignored.

Example:

```js
import { toJsonSchema } from '@valibot/to-json-schema';
import * as v from 'valibot';

toJsonSchema(v.blob(), { force: true }); // {} (empty schema)

toJsonSchema(v.pipe(v.string(), v.uuid()), { force: true }); // { type: "string" } (ignoring UUID validation)
```
