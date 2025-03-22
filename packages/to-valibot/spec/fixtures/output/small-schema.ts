import { InferOutput, array, boolean, email, isoDateTime, literal, maxLength, maxValue, minLength, minValue, number, object, optional, pipe, string, union, uuid } from "valibot";


export const UserSchema = object({
  id: pipe(string(), uuid()),
  name: pipe(string(), minLength(2), maxLength(100)),
  email: pipe(string(), email()),
  age: optional(pipe(number(), minValue(0), maxValue(150))),
  isActive: optional(boolean()),
  preferences: optional(object({
    theme: optional(union([
      literal('light'),
      literal('dark'),
      literal('system'),
    ])),
    notifications: optional(boolean()),
  })),
  tags: optional(pipe(array(string()), maxLength(10))),
  createdAt: optional(pipe(string(), isoDateTime())),
  metadata: optional(object({})),
});

export type User = InferOutput<typeof UserSchema>;


export const ErrorSchema = object({
  code: string(),
  message: string(),
  details: optional(object({})),
});

export type Error = InferOutput<typeof ErrorSchema>;
