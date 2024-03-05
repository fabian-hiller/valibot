export type Comparable = string | number | bigint | boolean | Date;

export type ToComparable<T extends Comparable> = T extends string
  ? string
  : T extends number
    ? number
    : T extends bigint
      ? bigint
      : T extends boolean
        ? boolean
        : T extends Date
          ? Date
          : never;
