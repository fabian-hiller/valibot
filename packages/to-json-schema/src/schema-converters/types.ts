import type { JSONSchema7 } from 'json-schema';
import type { GenericSchema } from 'valibot';

/** Function taking a schema and converting it to JSON schema */
export type SchemaConverter<TSchema extends GenericSchema> = (
  schema: TSchema,
  convert: SimpleSchemaConverter<GenericSchema>
) => JSONSchema7;

type SimpleSchemaConverter<TSchema extends GenericSchema> = (
  schema: TSchema
) => JSONSchema7;

/** Record of schema type to schema converter */
export type SchemaConverters<TSchema extends GenericSchema> = {
  [type in TSchema['type']]: SchemaConverter<Extract<TSchema, { type: type }>>;
};
