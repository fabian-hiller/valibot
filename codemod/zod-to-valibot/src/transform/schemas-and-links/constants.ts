export const ZOD_COERCEABLE_SCHEMAS = [
  'bigint',
  'boolean',
  'date',
  'number',
  'string',
] as const;

export const ZOD_UNCOERCEABLE_SCHEMAS = ['literal'] as const;

export const ZOD_SCHEMAS = [
  ...ZOD_COERCEABLE_SCHEMAS,
  ...ZOD_UNCOERCEABLE_SCHEMAS,
] as const;

export const ZOD_SCHEMA_TO_TYPE: Record<
  (typeof ZOD_SCHEMAS)[number],
  'value' | 'length' | null
> = {
  bigint: 'value',
  boolean: null,
  date: 'value',
  number: 'value',
  string: 'length',
  literal: null,
};

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

export const ZOD_SCHEMA_PROPERTIES = ['description'] as const;

export const ZOD_RESULT_PROPERTIES = ['data', 'error'] as const;

export const ZOD_PROPERTIES = [
  ...ZOD_SCHEMA_PROPERTIES,
  ...ZOD_RESULT_PROPERTIES,
] as const;

export const ZOD_METHODS = [
  'optional',
  'nullable',
  'parse',
  'parseAsync',
  'safeParse',
  'safeParseAsync',
  'spa',
] as const;

export const ZOD_TO_VALI_METHOD: Partial<
  Record<(typeof ZOD_METHODS)[number], string>
> = {
  spa: 'safeParseAsync',
};
