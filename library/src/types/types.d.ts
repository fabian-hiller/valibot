declare module 'valibot/types' {
  /**
   * Prettifies a type for better readability.
   *
   * Hint: This type has no effect and is only used so that TypeScript displays
   * the final type in the preview instead of the utility types used.
   */
  export type Prettify<TObject> = {
    [TKey in keyof TObject]: TObject[TKey];
    // eslint-disable-next-line @typescript-eslint/ban-types
  } & {};
}
