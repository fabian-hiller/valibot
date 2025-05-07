export const ZOD_COERCEABLE_SCHEMAS = [
  'bigint',
  'boolean',
  'date',
  'number',
  'string',
] as const;

export const ZOD_UNCOERCEABLE_SCHEMAS = [
  // 'any',
  // 'never',
  // 'null',
  // 'symbol',
  // 'undefined',
  // 'unknown',
  // 'void',
] as const;

export const ZOD_SCHEMAS = [
  ...ZOD_COERCEABLE_SCHEMAS,
  ...ZOD_UNCOERCEABLE_SCHEMAS,
] as const;

export const ZOD_VALIDATORS = [
  'describe',
  'email',
  'finite',
  'max',
  'min',
  'multipleOf',
  'trim',
  'url',
  'gt',
  'lt',
] as const;

export const VALIDATOR_TO_ACTION: Partial<
  Record<(typeof ZOD_VALIDATORS)[number], string>
> = {
  describe: 'description',
  max: 'maxValue',
  min: 'minValue',
  gt: 'gtValue',
  lt: 'ltValue',
};

export const ZOD_PROPERTIES = ['description'] as const;

export const ZOD_METHODS = ['optional', 'nullable', 'parse'] as const;
