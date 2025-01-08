import type { JSONSchema7 } from 'json-schema';
import * as v from 'valibot';
import { convertAction } from './convertAction.ts';
import type { ConversionConfig, ConversionContext } from './type.ts';
import { handleError } from './utils/index.ts';

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
      v.VariantOptions<string>,
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
  | v.UndefinedableSchema<
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
  | v.RecordSchema<
      v.BaseSchema<string, string | number | symbol, v.BaseIssue<unknown>>,
      v.BaseSchema<unknown, unknown, v.BaseIssue<unknown>>,
      v.ErrorMessage<v.RecordIssue> | undefined
    >
  | v.TupleSchema<v.TupleItems, v.ErrorMessage<v.TupleIssue> | undefined>
  | v.TupleWithRestSchema<
      v.TupleItems,
      v.BaseSchema<unknown, unknown, v.BaseIssue<unknown>>,
      v.ErrorMessage<v.TupleWithRestIssue> | undefined
    >
  | v.LooseTupleSchema<
      v.TupleItems,
      v.ErrorMessage<v.LooseTupleIssue> | undefined
    >
  | v.StrictTupleSchema<
      v.TupleItems,
      v.ErrorMessage<v.StrictTupleIssue> | undefined
    >
  | v.ArraySchema<
      v.BaseSchema<unknown, unknown, v.BaseIssue<unknown>>,
      v.ErrorMessage<v.ArrayIssue> | undefined
    >
  | v.LazySchema<v.BaseSchema<unknown, unknown, v.BaseIssue<unknown>>>;

/**
 * Schema or pipe type.
 */
type SchemaOrPipe =
  | Schema
  | v.SchemaWithPipe<
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      [Schema, ...(Schema | v.PipeAction<any, any, v.BaseIssue<unknown>>)[]]
    >;

// Create global reference count
let refCount = 0;

/**
 * Converts any supported Valibot schema to the JSON Schema format.
 *
 * @param jsonSchema The JSON Schema object.
 * @param valibotSchema The Valibot schema object.
 * @param config The conversion configuration.
 * @param context The conversion context.
 *
 * @returns The converted JSON Schema.
 */
export function convertSchema(
  jsonSchema: JSONSchema7,
  valibotSchema: SchemaOrPipe,
  config: ConversionConfig | undefined,
  context: ConversionContext
): JSONSchema7 {
  // If schema is in reference map, use reference and skip conversion
  const referenceId = context.referenceMap.get(valibotSchema);
  if (referenceId && referenceId in context.definitions) {
    jsonSchema.$ref = `#/$defs/${referenceId}`;
    return jsonSchema;
  }

  // If it is schema with pipe, convert each item of pipe
  if ('pipe' in valibotSchema) {
    for (let index = 0; index < valibotSchema.pipe.length; index++) {
      // Get current pipe item
      const valibotPipeItem = valibotSchema.pipe[index];

      if (valibotPipeItem.kind === 'schema') {
        // If pipe has multiple schemas, throw or warn
        if (index > 0) {
          handleError(
            'A "pipe" with multiple schemas cannot be converted to JSON Schema.',
            config
          );
        }

        // Otherwiese, convert Valibot schema to JSON Schema
        const tempJsonSchema = convertSchema(
          {},
          valibotPipeItem,
          config,
          context
        );

        // If temporary JSON Schema object is just a reference, merge its
        // definition into JSON Schema object
        if (tempJsonSchema.$ref) {
          // Hint: If the temporary JSON Schema is only a reference, we must
          // merge its definition into the JSON Schema object, since subsequent
          // pipe elements may modify it, which can result in an invalid JSON
          // Schema output.
          const referenceId = tempJsonSchema.$ref.split('/')[2];
          Object.assign(jsonSchema, context.definitions[referenceId]);

          // Otherwise, merge temporary JSON Schema into JSON Schema object
        } else {
          Object.assign(jsonSchema, tempJsonSchema);
        }

        // Otherwise, convert Valibot action to JSON Schema
      } else {
        // @ts-expect-error
        jsonSchema = convertAction(jsonSchema, valibotPipeItem, config);
      }
    }

    // Return converted JSON Schema
    return jsonSchema;
  }

  // Otherwise, convert individual schema to JSON Schema
  switch (valibotSchema.type) {
    // Primitive schemas

    case 'boolean': {
      jsonSchema.type = 'boolean';
      break;
    }

    case 'null': {
      jsonSchema.type = 'null';
      break;
    }

    case 'number': {
      jsonSchema.type = 'number';
      break;
    }

    case 'string': {
      jsonSchema.type = 'string';
      break;
    }

    // Complex schemas

    case 'array': {
      jsonSchema.type = 'array';
      jsonSchema.items = convertSchema(
        {},
        valibotSchema.item as SchemaOrPipe,
        config,
        context
      );
      break;
    }

    case 'tuple':
    case 'tuple_with_rest':
    case 'loose_tuple':
    case 'strict_tuple': {
      jsonSchema.type = 'array';

      // Add JSON Schema of items
      jsonSchema.items = [];
      for (const item of valibotSchema.items) {
        jsonSchema.items.push(
          convertSchema({}, item as SchemaOrPipe, config, context)
        );
      }

      // Add additional items depending on schema type
      if (valibotSchema.type === 'tuple_with_rest') {
        jsonSchema.additionalItems = convertSchema(
          {},
          valibotSchema.rest as SchemaOrPipe,
          config,
          context
        );
      } else {
        jsonSchema.additionalItems = valibotSchema.type === 'loose_tuple';
      }

      break;
    }

    case 'object':
    case 'object_with_rest':
    case 'loose_object':
    case 'strict_object': {
      jsonSchema.type = 'object';

      // Add JSON Schema of properties and mark required keys
      jsonSchema.properties = {};
      jsonSchema.required = [];
      for (const key in valibotSchema.entries) {
        const entry = valibotSchema.entries[key] as SchemaOrPipe;
        jsonSchema.properties[key] = convertSchema({}, entry, config, context);
        if (entry.type !== 'nullish' && entry.type !== 'optional') {
          jsonSchema.required.push(key);
        }
      }

      // Add additional properties depending on schema type
      if (valibotSchema.type === 'object_with_rest') {
        jsonSchema.additionalProperties = convertSchema(
          {},
          valibotSchema.rest as SchemaOrPipe,
          config,
          context
        );
      } else {
        jsonSchema.additionalProperties = valibotSchema.type === 'loose_object';
      }

      break;
    }

    case 'record': {
      if ('pipe' in valibotSchema.key) {
        handleError(
          'The "record" schema with a schema for the key that contains a "pipe" cannot be converted to JSON Schema.',
          config
        );
      }
      if (valibotSchema.key.type !== 'string') {
        handleError(
          `The "record" schema with the "${valibotSchema.key.type}" schema for the key cannot be converted to JSON Schema.`,
          config
        );
      }
      jsonSchema.type = 'object';
      jsonSchema.additionalProperties = convertSchema(
        {},
        valibotSchema.value as SchemaOrPipe,
        config,
        context
      );
      break;
    }

    // Special schemas

    case 'any':
    case 'unknown': {
      break;
    }

    case 'nullable':
    case 'nullish': {
      // Add union of wrapped schema and null to JSON Schema
      jsonSchema.anyOf = [
        convertSchema(
          {},
          valibotSchema.wrapped as SchemaOrPipe,
          config,
          context
        ),
        { type: 'null' },
      ];

      // Add default value to JSON Schema, if available
      if (valibotSchema.default !== undefined) {
        // @ts-expect-error
        jsonSchema.default = v.getDefault(valibotSchema);
      }

      break;
    }

    case 'optional':
    case 'undefinedable': {
      // Convert wrapped schema to JSON Schema
      jsonSchema = convertSchema(
        jsonSchema,
        valibotSchema.wrapped as SchemaOrPipe,
        config,
        context
      );

      // Add default value to JSON Schema, if available
      if (valibotSchema.default !== undefined) {
        // @ts-expect-error
        jsonSchema.default = v.getDefault(valibotSchema);
      }

      break;
    }

    case 'literal': {
      if (
        typeof valibotSchema.literal !== 'boolean' &&
        typeof valibotSchema.literal !== 'number' &&
        typeof valibotSchema.literal !== 'string'
      ) {
        handleError(
          'The value of the "literal" schema is not JSON compatible.',
          config
        );
      }
      // @ts-expect-error
      jsonSchema.const = valibotSchema.literal;
      break;
    }

    case 'enum': {
      jsonSchema.enum = valibotSchema.options;
      break;
    }

    case 'picklist': {
      if (
        valibotSchema.options.some(
          (option) => typeof option !== 'number' && typeof option !== 'string'
        )
      ) {
        handleError(
          'An option of the "picklist" schema is not JSON compatible.',
          config
        );
      }
      // @ts-expect-error
      jsonSchema.enum = valibotSchema.options;
      break;
    }

    case 'union':
    case 'variant': {
      jsonSchema.anyOf = valibotSchema.options.map((option) =>
        convertSchema({}, option as SchemaOrPipe, config, context)
      );
      break;
    }

    case 'intersect': {
      jsonSchema.allOf = valibotSchema.options.map((option) =>
        convertSchema({}, option as SchemaOrPipe, config, context)
      );
      break;
    }

    case 'lazy': {
      // Get wrapped Valibot schema
      let wrappedValibotSchema = context.getterMap.get(valibotSchema.getter);

      // Add wrapped Valibot schema to getter map, if necessary
      if (!wrappedValibotSchema) {
        wrappedValibotSchema = valibotSchema.getter(undefined);
        context.getterMap.set(valibotSchema.getter, wrappedValibotSchema);
      }

      // Get reference ID of wrapped Valibot schema
      let referenceId = context.referenceMap.get(wrappedValibotSchema);

      // Add wrapped Valibot schema to reference map and definitions, if necessary
      if (!referenceId) {
        referenceId = `${refCount++}`;
        context.referenceMap.set(wrappedValibotSchema, referenceId);
        context.definitions[referenceId] = convertSchema(
          {},
          wrappedValibotSchema as SchemaOrPipe,
          config,
          context
        );
      }

      // Add reference to JSON Schema object
      jsonSchema.$ref = `#/$defs/${referenceId}`;

      break;
    }

    // Other schemas

    default: {
      handleError(
        // @ts-expect-error
        `The "${valibotSchema.type}" schema cannot be converted to JSON Schema.`,
        config
      );
    }
  }

  // Return converted JSON Schema
  return jsonSchema;
}
