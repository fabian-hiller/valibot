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

export const VALIDATOR_TO_NUM_ARGS: Partial<Record<ZodValidator, number>> = {
  endsWith: 2,
  gte: 2,
  includes: 2,
  length: 2,
  lt: 2,
  lte: 2,
  max: 2,
  min: 2,
  multipleOf: 2,
  regex: 2,
  size: 2,
  startsWith: 2,
};

export const ZOD_PROPERTIES = ['description'] as const;

export const ZOD_METHODS = ['optional', 'nullable', 'parse'] as const;
