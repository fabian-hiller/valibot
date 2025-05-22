export const ZOD_SCHEMAS = [
  'bigint',
  'boolean',
  'date',
  'enum',
  'literal',
  'nativeEnum',
  'nullable',
  'number',
  'object',
  'optional',
  'string',
] as const;

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

export const ZOD_SCHEMA_PROPERTIES = ['description', 'shape'] as const;

export const ZOD_RESULT_PROPERTIES = ['data', 'error'] as const;

export const ZOD_PROPERTIES = [
  ...ZOD_SCHEMA_PROPERTIES,
  ...ZOD_RESULT_PROPERTIES,
] as const;

export const ZOD_METHODS = [
  'extract',
  'keyof',
  'optional',
  'nullable',
  'nullish',
  'parse',
  'parseAsync',
  'passthrough',
  'safeParse',
  'safeParseAsync',
  'strict',
  'spa',
  'unwrap',
] as const;
