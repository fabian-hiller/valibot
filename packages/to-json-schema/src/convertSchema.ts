import type { JSONSchema7, JSONSchema7Type } from 'json-schema';
import * as v from 'valibot';
import { convertAction } from './convertAction.ts';
import type { JsonSchemaConfig } from './type.ts';
import { assertJSON } from './utils/assertJSON.ts';

/**
 * Schema type.
 */
type Schema =
  | v.AnySchema
  | v.UnknownSchema
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
  | v.StringSchema<v.ErrorMessage<v.StringIssue> | undefined>
  | v.BooleanSchema<v.ErrorMessage<v.BooleanIssue> | undefined>
  | v.NumberSchema<v.ErrorMessage<v.NumberIssue> | undefined>
  | v.LiteralSchema<v.Literal, v.ErrorMessage<v.LiteralIssue> | undefined>
  | v.PicklistSchema<
      v.PicklistOptions,
      v.ErrorMessage<v.PicklistIssue> | undefined
    >
  | v.EnumSchema<v.Enum, v.ErrorMessage<v.EnumIssue> | undefined>
  | v.VariantSchema<
      string,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      any,
      v.ErrorMessage<v.VariantIssue> | undefined
    >
  | v.UnionSchema<
      v.UnionOptions,
      v.ErrorMessage<v.UnionIssue<v.BaseIssue<unknown>>> | undefined
    >
  | v.IntersectSchema<
      v.IntersectOptions,
      v.ErrorMessage<v.IntersectIssue> | undefined
    >
  | v.ObjectSchema<v.ObjectEntries, v.ErrorMessage<v.ObjectIssue> | undefined>
  | v.ObjectWithRestSchema<
      v.ObjectEntries,
      v.BaseSchema<unknown, unknown, v.BaseIssue<unknown>>,
      v.ErrorMessage<v.ObjectWithRestIssue> | undefined
    >
  | v.OptionalSchema<
      v.BaseSchema<unknown, unknown, v.BaseIssue<unknown>>,
      v.Default<v.BaseSchema<unknown, unknown, v.BaseIssue<unknown>>, undefined>
    >
  | v.StrictObjectSchema<
      v.ObjectEntries,
      v.ErrorMessage<v.StrictObjectIssue> | undefined
    >
  | v.LooseObjectSchema<
      v.ObjectEntries,
      v.ErrorMessage<v.LooseObjectIssue> | undefined
    >
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  | v.RecordSchema<any, any, v.ErrorMessage<v.RecordIssue> | undefined>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  | v.TupleSchema<any, v.ErrorMessage<v.TupleIssue> | undefined>
  | v.TupleWithRestSchema<
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      any,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      any,
      v.ErrorMessage<v.TupleWithRestIssue> | undefined
    >
  | v.LooseTupleSchema<
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      any,
      v.ErrorMessage<v.LooseTupleIssue> | undefined
    >
  | v.StrictTupleSchema<
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      any,
      v.ErrorMessage<v.StrictTupleIssue> | undefined
    >
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  | v.ArraySchema<any, v.ErrorMessage<v.ArrayIssue> | undefined>;

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

    case 'boolean': {
      json.type = 'boolean';
      break;
    }

    case 'number': {
      json.type = 'number';
      break;
    }

    case 'string': {
      json.type = 'string';
      break;
    }

    case 'literal': {
      if (
        assertJSON(
          schema.literal,
          config?.force,
          'Literal value provided is not JSON compatible.'
        )
      ) {
        json.const = schema.literal;
      }
      break;
    }

    case 'enum':
    case 'picklist': {
      const options = Object.values(schema.options);
      if (!config?.force) {
        for (const option of options) {
          assertJSON(
            option,
            config?.force,
            'Picklist option provided is not JSON compatible.'
          );
        }
      }
      json.enum = options as JSONSchema7Type[];
      break;
    }

    case 'variant':
    case 'union': {
      json.anyOf = schema.options.map((option: SchemaOrPipe) =>
        convertSchema({}, option, config)
      );
      break;
    }

    case 'intersect': {
      json.allOf = schema.options.map((option) =>
        convertSchema({}, option as SchemaOrPipe, config)
      );
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

    case 'record': {
      if (!config?.force && schema.key.type !== 'string') {
        throw new Error('Record key schema provided is not supported.');
      }
      json.type = 'object';
      json.additionalProperties = convertSchema(
        {},
        schema.value as SchemaOrPipe,
        config
      );
      break;
    }

    case 'tuple':
    case 'tuple_with_rest':
    case 'loose_tuple':
    case 'strict_tuple': {
      json.type = 'array';
      json.items = [];
      for (const item of schema.items) {
        json.items.push(convertSchema({}, item as SchemaOrPipe, config));
      }
      if (schema.type === 'tuple_with_rest') {
        json.additionalItems = convertSchema(
          {},
          schema.rest as SchemaOrPipe,
          config
        );
      } else {
        json.additionalItems = schema.type === 'loose_tuple';
      }
      break;
    }

    case 'array': {
      json.type = 'array';
      json.items = convertSchema({}, schema.item as SchemaOrPipe, config);
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
