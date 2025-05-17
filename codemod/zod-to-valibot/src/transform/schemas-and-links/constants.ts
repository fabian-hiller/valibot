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

export const ZOD_SCHEMA_TO_NUM_ARGS: Record<
  (typeof ZOD_SCHEMAS)[number],
  number
> = {
  bigint: 1,
  boolean: 1,
  date: 1,
  number: 1,
  string: 1,
  literal: 2,
};

export const ZOD_VALIDATORS = [
  'describe',
  'email',
  'endsWith',
  'finite',
  'includes',
  'length',
  'max',
  'min',
  'multipleOf',
  'regex',
  'size',
  'startsWith',
  'trim',
  'url',
  'gt',
  'gte',
  'lt',
  'lte',
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
