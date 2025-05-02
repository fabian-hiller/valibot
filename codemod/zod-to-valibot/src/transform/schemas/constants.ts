export const ZOD_SCHEMAS = [
  'string',
  // 'any',
  // 'bigint',
  // 'boolean',
  // 'date',
  // 'never',
  // 'null',
  // 'number',
  // 'symbol',
  // 'undefined',
  // 'unknown',
  // 'void',
] as const;

export const ZOD_VALIDATORS = ['email', 'trim'] as const;

export const ZOD_METHODS = ['optional', 'nullable', 'parse'] as const;
