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

type ZodValidator = (typeof ZOD_VALIDATORS)[number];

export const VALIDATOR_TO_ACTION: Partial<Record<ZodValidator, string>> = {
  describe: 'description',
  max: 'maxValue',
  min: 'minValue',
  gt: 'gtValue',
  gte: 'minValue',
  lt: 'ltValue',
  lte: 'maxValue',
};

export const VALIDATOR_TO_NUM_ARGS: Record<ZodValidator, number> = {
  describe: 1,
  email: 1,
  endsWith: 2,
  finite: 1,
  includes: 2,
  length: 2,
  max: 2,
  min: 2,
  multipleOf: 2,
  regex: 2,
  size: 2,
  startsWith: 2,
  trim: 0,
  url: 1,
  gt: 2,
  gte: 2,
  lt: 2,
  lte: 2,
};

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
