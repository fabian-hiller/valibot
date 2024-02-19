/**
 * Array path item type.
 */
export type ArrayPathItem = {
  type: 'array';
  origin: 'value';
  input: unknown[];
  key: number;
  value: unknown;
};
