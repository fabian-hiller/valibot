interface JSONSchemaBase {
  title?: string;
  description?: string;
  default?: any;
  examples?: any[];
  $comment?: string;
  $id?: string;
  $schema?: string;
  definitions?: Record<string, JSONSchema>;
  enum?: any[];
  const?: any;
  readOnly?: boolean;
  writeOnly?: boolean;
}

interface JSONSchemaString extends JSONSchemaBase {
  type: 'string';
  minLength?: number;
  maxLength?: number;
  pattern?: string;
  format?: string;
  contentMediaType?: string;
  contentEncoding?: string;
  enum?: string[];
}

interface JSONSchemaNumber extends JSONSchemaBase {
  type: 'number' | 'integer';
  multipleOf?: number;
  minimum?: number;
  maximum?: number;
  exclusiveMinimum?: number;
  exclusiveMaximum?: number;
}

interface JSONSchemaBoolean extends JSONSchemaBase {
  type: 'boolean';
}

interface JSONSchemaNull extends JSONSchemaBase {
  type: 'null';
}

interface JSONSchemaArray extends JSONSchemaBase {
  type: 'array';
  items?: JSONSchema | JSONSchema[];
  additionalItems?: boolean | JSONSchema;
  minItems?: number;
  maxItems?: number;
  uniqueItems?: boolean;
  contains?: JSONSchema;
}

interface JSONSchemaObject extends JSONSchemaBase {
  type: 'object';
  properties?: Record<string, JSONSchema>;
  patternProperties?: Record<string, JSONSchema>;
  additionalProperties?: boolean | JSONSchema;
  required?: string[];
  propertyNames?: JSONSchema;
  minProperties?: number;
  maxProperties?: number;
  dependencies?: Record<string, JSONSchema | string[]>;
}

interface JSONSchemaCombined extends JSONSchemaBase {
  allOf?: JSONSchema[];
  anyOf?: JSONSchema[];
  oneOf?: JSONSchema[];
  not?: JSONSchema;
}

interface JSONSchemaRef {
  $ref: string;
}

type JSONSchema =
  | JSONSchemaString
  | JSONSchemaNumber
  | JSONSchemaBoolean
  | JSONSchemaNull
  | JSONSchemaArray
  | JSONSchemaObject
  // | JSONSchemaCombined
  | JSONSchemaRef;

export type {
  JSONSchema,
  JSONSchemaString,
  JSONSchemaNumber,
  JSONSchemaBoolean,
  JSONSchemaNull,
  JSONSchemaArray,
  JSONSchemaObject,
  JSONSchemaCombined,
  JSONSchemaRef,
};
