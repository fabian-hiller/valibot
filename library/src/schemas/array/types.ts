/**
 * Array path item type.
 */
export interface ArrayPathItem {
  type: 'array';
  origin: 'value';
  input: unknown[];
  key: number;
  value: unknown;
}
