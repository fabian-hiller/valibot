# Valibot to JSON Schema converter

Utility to convert [Valibot](https://valibot.dev) schemas to JSON schema (draft 07).

```js
import * as v from 'valibot';
import { toJsonSchema } from '@valibot/to-json-schema';

toJsonSchema(v.string());
// => `{ type: 'string' }`
```

Some valibot features can't map to JSON schema. Valibot transformations have no equivalent in JSON schema as it only 
does validation. And also some Valibot schemas or validations are too specific to JS and do not have an equivalent 
JSON schema attribute.

## Supported features

**Warning**: Converted schema might have slightly different behavior in JSON schema validators (especially on string 
format) since their implementation is different from Valibot's implementation.

Here are the supported Valibot features:

| feature            | status                      |
|--------------------|-----------------------------|
| `any` schema       | ✅ supported                 |
| `null` schema      | ✅ supported                 |
| `string` schema    | ✅ supported                 |
| `object` schema    | ✅ supported                 |
| `email` validation | ✅ supported (string format) |

## Options 

### Force conversion

To force the conversion of unsupported Valibot features, you can provide the `force: true` option.

Unsupported schemas will return the empty JSON schema (`{}`) and unsupported validations or transformations will be 
ignored.

Example:
```js
import * as v from 'valibot';
import { toJsonSchema } from '@valibot/to-json-schema';

toJsonSchema(v.blob(), { force: true });
// => `{}` (empty schema) 

toJsonSchema(v.pipe(v.string(), v.mac64()), { force: true });
// => `{ type: 'string' }` (ignoring the unsupported mac64 validation) 
```
