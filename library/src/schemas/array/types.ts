/**
 * Array path item type.
 */
export type ArrayPathItem = {
  type: 'array';
  input: unknown[];
  key: number;
  value: unknown;
};
