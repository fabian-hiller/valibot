/* minValue and maxValue input/output types */
export type MinMaxValueIO = string | number | bigint | boolean | Date;

/* literals to minValue and maxValue input/output types */
export type ToMinMaxValueIO<T extends MinMaxValueIO> = T extends string
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
