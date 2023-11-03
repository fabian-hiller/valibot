/**
 * Picklist options type.
 */
export type PicklistOptions<TOption extends string = string> =
  | Readonly<[TOption, ...TOption[]]>
  | [TOption, ...TOption[]];
