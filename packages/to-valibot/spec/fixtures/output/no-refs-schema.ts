import { CheckItemsAction, InferOutput, array, boolean, checkItems, description, email, maxLength, maxValue, minLength, minValue, number, object, optional, pipe, string } from "valibot";


const uniqueItems = <Type, Message extends string>(
  message?: Message
): CheckItemsAction<Type[], Message | undefined> =>
  checkItems((item, i, arr) => arr.indexOf(item) === i, message);


export const NoRefsSchema = pipe(object({
  name: pipe(string(), minLength(2), maxLength(50), description("Name of a person")),
  age: pipe(number(), minValue(0), maxValue(150), description("Age of a person")),
  email: pipe(string(), email(), description("Email address of a person")),
  isActive: optional(pipe(boolean(), description("Indicates if user is currently active"))),
  tags: optional(pipe(array(string()), maxLength(5), uniqueItems(), description("Tags by which user can be found"))),
}), description("Schema without any references defining a person"));

export type NoRefs = InferOutput<typeof NoRefsSchema>;
