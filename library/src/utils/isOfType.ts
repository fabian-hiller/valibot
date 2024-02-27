export const isOfType = <
  U extends { type: string },
  const T extends string = string
>(
  val: U,
  type: T
): val is Extract<U, { type: T }> => val?.type === type;
