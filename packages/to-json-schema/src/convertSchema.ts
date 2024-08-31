import type { JSONSchema7 } from 'json-schema';
import * as v from 'valibot';
import { convertAction } from './convertAction.ts';
import type { JsonSchemaConfig } from './type.ts';
import { assertJSON } from './utils/assertJSON.ts';

/**
 * Schema type.
 */
type Schema =
  | v.AnySchema
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  | v.LooseObjectSchema<any, v.ErrorMessage<v.LooseObjectIssue> | undefined>
  | v.NullableSchema<
      v.BaseSchema<unknown, unknown, v.BaseIssue<unknown>>,
      v.Default<v.BaseSchema<unknown, unknown, v.BaseIssue<unknown>>, null>
    >
  | v.NullishSchema<
      v.BaseSchema<unknown, unknown, v.BaseIssue<unknown>>,
      v.Default<
        v.BaseSchema<unknown, unknown, v.BaseIssue<unknown>>,
        null | undefined
      >
    >
  | v.NullSchema<v.ErrorMessage<v.NullIssue> | undefined>
  | v.NumberSchema<v.ErrorMessage<v.NumberIssue> | undefined>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  | v.ObjectSchema<any, v.ErrorMessage<v.ObjectIssue> | undefined>
  | v.ObjectWithRestSchema<
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      any,
      v.BaseSchema<unknown, unknown, v.BaseIssue<unknown>>,
      v.ErrorMessage<v.ObjectWithRestIssue> | undefined
    >
  | v.OptionalSchema<
      v.BaseSchema<unknown, unknown, v.BaseIssue<unknown>>,
      v.Default<v.BaseSchema<unknown, unknown, v.BaseIssue<unknown>>, undefined>
    >
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  | v.StrictObjectSchema<any, v.ErrorMessage<v.StrictObjectIssue> | undefined>
  | v.StringSchema<v.ErrorMessage<v.StringIssue> | undefined>
  | v.UnknownSchema;

/**
 * Schema or pipe type.
 */
type SchemaOrPipe =
  | Schema
  | v.SchemaWithPipe<
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      [Schema, ...(Schema | v.PipeAction<any, any, v.BaseIssue<unknown>>)[]]
    >;

/**
 * Converts any supported Valibot schema to the JSON schema format.
 *
 * @param json The JSON schema object.
 * @param schema The Valibot schema object.
 * @param config The JSON schema configuration.
 *
 * @returns The converted JSON schema.
 */
export function convertSchema(
  json: JSONSchema7,
  schema: SchemaOrPipe,
  config: JsonSchemaConfig | undefined
): JSONSchema7 {
  // If it is schema with pipe, convert each item of pipe
  if ('pipe' in schema) {
    for (let index = 0; index < schema.pipe.length; index++) {
      const action = schema.pipe[index];
      if (action.kind === 'schema') {
        if (index > 0) {
          if (!config?.force) {
            throw new Error(
              'A "pipe" with multiple schemas cannot be converted to JSON schema.'
            );
          }
          return json;
        }
        convertSchema(json, action, config);
      } else {
        // @ts-expect-error
        convertAction(json, action, config);
      }
    }
    return json;
  }

  // Otherwise, convert individual schema to JSON schema
  switch (schema.type) {
    case 'any':
    case 'unknown': {
      break;
    }

    case 'null': {
      json.type = 'null';
      break;
    }

    case 'nullable':
    case 'nullish': {
      json.anyOf = [
        convertSchema({}, schema.wrapped as SchemaOrPipe, config),
        { type: 'null' },
      ];
      const defaultValue = v.getDefault(schema);
      if (
        defaultValue !== undefined &&
        assertJSON(
          defaultValue,
          config?.force,
          `Default value for '${schema.type}' is not JSON compatible.`
        )
      ) {
        json.default = defaultValue;
      }
      break;
    }

    case 'number': {
      json.type = 'number';
      break;
    }

    case 'object':
    case 'object_with_rest':
    case 'loose_object':
    case 'strict_object': {
      json.type = 'object';
      json.properties = {};
      json.required = [];
      for (const key in schema.entries) {
        const entry = schema.entries[key] as SchemaOrPipe;
        json.properties[key] = convertSchema({}, entry, config);
        if (entry.type !== 'nullish' && entry.type !== 'optional') {
          json.required.push(key);
        }
      }
      if (schema.type === 'object_with_rest') {
        json.additionalProperties = convertSchema(
          {},
          schema.rest as SchemaOrPipe,
          config
        );
      } else {
        json.additionalProperties = schema.type === 'loose_object';
      }
      break;
    }

    case 'optional': {
      json = convertSchema({}, schema.wrapped as SchemaOrPipe, config);
      const defaultValue = v.getDefault(schema);
      if (
        defaultValue !== undefined &&
        assertJSON(
          defaultValue,
          config?.force,
          `Default value for '${schema.type}' is not JSON compatible.`
        )
      ) {
        json.default = defaultValue;
      }
      break;
    }

    case 'string': {
      json.type = 'string';
      break;
    }

    default: {
      if (!config?.force) {
        throw new Error(
          // @ts-expect-error
          `The "${schema.type}" schema cannot be converted to JSON schema.`
        );
      }
    }
  }
  return json;
}
