import { ZodSchemaType } from './types';

export const ZOD_SCHEMAS = [
  'array',
  'bigint',
  'boolean',
  'date',
  'enum',
  'instanceof',
  'literal',
  'nativeEnum',
  'nullable',
  'record',
  'map',
  'number',
  'object',
  'optional',
  'set',
  'string',
] as const;

export const ZOD_SCHEMA_TO_TYPE: Record<
  (typeof ZOD_SCHEMAS)[number],
  ZodSchemaType
> = {
  array: 'length',
  bigint: 'value',
  boolean: 'value',
  date: 'value',
  enum: 'none',
  instanceof: 'none',
  literal: 'none',
  map: 'size',
  nativeEnum: 'none',
  nullable: 'none',
  record: 'none',
  number: 'value',
  object: 'none',
  optional: 'none',
  set: 'size',
  string: 'length',
};

export const ZOD_VALUE_TYPE_SCHEMAS: readonly (typeof ZOD_SCHEMAS)[number][] = [
  'bigint',
  'date',
  'number',
];

export const ZOD_VALIDATORS = [
  'base64',
  'base64url',
  'cidr',
  'cuid',
  'cuid2',
  'date',
  'datetime',
  'describe',
  'duration',
  'email',
  'emoji',
  'endsWith',
  'finite',
  'includes',
  'int',
  'ip',
  'length',
  'jwt',
  'max',
  'min',
  'multipleOf',
  'nanoid',
  'negative',
  'nonempty',
  'nonnegative',
  'nonpositive',
  'positive',
  'regex',
  'safe',
  'size',
  'startsWith',
  'toLowerCase',
  'toUpperCase',
  'trim',
  'url',
  'gt',
  'gte',
  'lt',
  'lte',
  'time',
  'ulid',
  'uuid',
] as const;

export const ZOD_SCHEMA_PROPERTIES = [
  'element',
  'description',
  'shape',
] as const;

export const ZOD_RESULT_PROPERTIES = ['data', 'error'] as const;

export const ZOD_PROPERTIES = [
  ...ZOD_SCHEMA_PROPERTIES,
  ...ZOD_RESULT_PROPERTIES,
] as const;

export const ZOD_METHODS = [
  'array',
  'default',
  'extract',
  'keyof',
  'omit',
  'optional',
  'nullable',
  'nullish',
  'parse',
  'parseAsync',
  'partial',
  'passthrough',
  'pick',
  'required',
  'safeParse',
  'safeParseAsync',
  'strict',
  'strip',
  'spa',
  'unwrap',
] as const;
