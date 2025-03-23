import { InferOutput, array, boolean, description, email, isoDateTime, literal, maxLength, maxValue, minLength, minValue, number, object, optional, pipe, string, union, uuid } from "valibot";


export const UserSchema = object({
  id: pipe(string(), uuid(), description("Unique identifier for the user")),
  name: pipe(string(), minLength(2), maxLength(100), description("Full name of the user")),
  email: pipe(string(), email(), description("User's email address")),
  age: optional(pipe(number(), minValue(0), maxValue(150), description("User's age in years"))),
  isActive: optional(pipe(boolean(), description("Whether the user account is active"))),
  preferences: optional(object({
    theme: optional(union([
      literal('light'),
      literal('dark'),
      literal('system'),
    ])),
    notifications: optional(boolean()),
  })),
  tags: optional(pipe(array(string()), maxLength(10), description("User's associated tags"))),
  createdAt: optional(pipe(string(), isoDateTime(), description("When the user was created"))),
  metadata: optional(pipe(object({}), description("Additional user metadata"))),
});

export type User = InferOutput<typeof UserSchema>;


export const ErrorSchema = object({
  code: pipe(string(), description("Error code")),
  message: pipe(string(), description("Error message")),
  details: optional(pipe(object({}), description("Additional error details"))),
});

export type Error = InferOutput<typeof ErrorSchema>;
