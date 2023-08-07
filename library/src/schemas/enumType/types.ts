/**
 * Enum type.
 */
export type Enum<TOption extends string = string> =
  | Readonly<[TOption, ...TOption[]]>
  | [TOption, ...TOption[]];
