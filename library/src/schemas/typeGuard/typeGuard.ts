import {
  BaseSchema,
  getIssues,
} from "valibot";

// https://stackoverflow.com/a/62097481/335243
type TypeGuard<T> = T extends (x: any) => x is infer U ? T : never;

type GuardedType<T> = T extends (x: any) => x is infer U ? U : never;

export type TypeGuardSchema<T> = BaseSchema<boolean, GuardedType<T>> & {
  schema: 'typeGuard';
};

export function typeGuard<T extends any>(guard: TypeGuard<T>): TypeGuardSchema<T> {
  return {
    schema: 'typeguard',
    async: false,
    _parse(input, info) {
      if (!guard(input)) {
        return getIssues(
          info,
          "type",
          "typeGuard",
          "Invalid type",
          input
        );
      }

      return { output: input as GuardedType<T> }
    }
  }
}
