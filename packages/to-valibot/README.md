# (OpenAPI Declaration, JSON Schema) to Valibot

Utility to convert JSON Schemas and OpenAPI Declarations to [Valibot](https://valibot.dev) schemas.

## Example usage

### 1. Converting list of OpenAPI Declarations in .json format to Valibot
```ts
import { valibotGenerator } from "@valibot/to-valibot";

const generate = valibotGenerator({
  outDir: "./src/types",
});

const schemas = await Promise.all([
  fetch("http://api.example.org/v2/api-docs?group=my-awesome-api").then(r => r.json()),
  fetch("http://api.example.org/v2/api-docs?group=other-api").then(r => r.json()),
  fetch("http://api.example.org/v2/api-docs?group=legacy-api").then(r => r.json()),
]);

await generate({
  format: 'openapi-json',
  schemas,
});
```

### 2. Converting OpenAPI Declarations in .yaml format to Valibot
```ts
import { readFile } from "node:fs/promises";;
import { valibotGenerator } from "@valibot/to-valibot";

const generate = valibotGenerator({
  outDir: "./src/types",
});

const schema = readFile("./declarations/my-awesome-api.yaml");

await generate({
  format: 'openapi-yaml',
  schema,
});
```

### 3. Converting JSON Schema to Valibot
```ts
import { readFile } from "node:fs/promises";;
import { valibotGenerator } from "@valibot/to-valibot";
import schema from "~/schemas/my-api.json";

const generate = valibotGenerator({
  outDir: "./src/types",
});

await generate({
  format: 'json',
  schema,
});
```

## API

### valibotGenerator

`valibotGenerator` accepts options object with these parameters

| Name    | Type    | Required  | Description                                                       |
| ------- | ------- | --------- | ----------------------------------------------------------------- |
| outDir  | string  | yes       | Declare in which directory generated schema(s) should be written  |

### generate

`generate` function returned by `valibotGenerator` accepts different set of options, depending on format.

| Name     | Type           | Required  | Description                                   |
| -------- | -------------- | --------- | --------------------------------------------- |
| format   | 'openapi-yaml' | yes       | Format specification for the generated output |
| schema   | string         | no*       | Single schema to be processed                 |
| schemas  | string[]       | no*       | Multiple schemas to be processed              |
\* Either `schema` OR `schemas` must be provided, but not both.

| Name     | Type                     | Required  | Description                                   |
| -------- | ------------------------ | --------- | --------------------------------------------- |
| format   | 'openapi-json' \| 'json' | yes       | Format specification for the generated output |
| schema   | string \| object         | no*       | Single schema to be processed                 |
| schemas  | (string \| object)[]     | no*       | Multiple schemas to be processed              |
\* Either `schema` OR `schemas` must be provided, but not both.


## Supported features

Same set of features are supported both in OpenAPI Declarations and JSON Schemas

| Feature                         | Status | Note                                                                |
| ------------------------------- | ------ | ------------------------------------------------------------------- |
| required                        | ✅     |                                                                     |
| description                     | ✅     |                                                                     |
| const                           | ❌     |                                                                     |
|---------------------------------|--------|---------------------------------------------------------------------|
| string                          | ✅     |                                                                     |
| enum                            | ✅     |                                                                     |
| minLength                       | ✅     |                                                                     |
| maxLength                       | ✅     |                                                                     |
| pattern                         | ✅     |                                                                     |
| format="email"                  | ✅     |                                                                     |
| format="uuid"                   | ✅     |                                                                     |
| format="date-time"              | ✅     |                                                                     |
| format="date"                   | ✅     |                                                                     |
| format="time"                   | ✅     |                                                                     |
| format="duration"               | ❌     |                                                                     |
| format="idn-email"              | ❌     |                                                                     |
| format="hostname"               | ❌     |                                                                     |
| format="idn-hostname"           | ❌     |                                                                     |
| format="ipv4"                   | ✅     |                                                                     |
| format="ipv6"                   | ✅     |                                                                     |
| format="json-pointer"           | ❌     |                                                                     |
| format="relative-json-pointer"  | ❌     |                                                                     |
| format="uri"                    | ❌     |                                                                     |
| format="uri-reference"          | ❌     |                                                                     |
| format="uri-template"           | ❌     |                                                                     |
| format="iri"                    | ❌     |                                                                     |
| format="iri-reference"          | ❌     |                                                                     |
|---------------------------------|--------|---------------------------------------------------------------------|
| number                          | ✅     |                                                                     |
| integer                         | ⚠️      | It only checks if it's a number for now                             |
| exclusiveMaximum                | ✅     |                                                                     |
| exclusiveMinium                 | ✅     |                                                                     |
| maximum                         | ✅     |                                                                     |
| minium                          | ✅     |                                                                     |
| multipleOf                      | ✅     |                                                                     |
|---------------------------------|--------|---------------------------------------------------------------------|
| array                           | ⚠️      | Only single array item kind is supported for now                    |
| minItems                        | ✅     |                                                                     |
| maxItems                        | ✅     |                                                                     |
| uniqueItems                     | ✅     |                                                                     |
| prefixItems                     | ❌     |                                                                     |
| contains                        | ❌     |                                                                     |
| minContains                     | ❌     |                                                                     |
| maxContains                     | ❌     |                                                                     |
|---------------------------------|--------|---------------------------------------------------------------------|
| object                          | ✅     |                                                                     |
| patternProperties               | ❌     |                                                                     |
| additionalProperties            | ❌     |                                                                     |
| minProperties                   | ❌     |                                                                     |
| maxProperties                   | ❌     |                                                                     |
|---------------------------------|--------|---------------------------------------------------------------------|
| boolean                         | ✅     |                                                                     |
| null                            | ✅     |                                                                     |
|---------------------------------|--------|---------------------------------------------------------------------|
| anyOf                           | ❌     |                                                                     |
| allOf                           | ❌     |                                                                     |
| oneOf                           | ❌     |                                                                     |
| not                             | ❌     |                                                                     |