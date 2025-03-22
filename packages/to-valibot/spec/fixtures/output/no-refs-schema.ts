import { CheckItemsAction, InferOutput, array, boolean, checkItems, email, maxLength, maxValue, minLength, minValue, number, object, optional, pipe, string } from "valibot";


const uniqueItems = <Type, Message extends string>(
  message?: Message
): CheckItemsAction<Type[], Message | undefined> =>
  checkItems((item, i, arr) => arr.indexOf(item) === i, message);


export const NoRefsSchema = object({
  name: pipe(string(), minLength(2), maxLength(50)),
  age: pipe(number(), minValue(0), maxValue(150)),
  email: pipe(string(), email()),
  isActive: optional(boolean()),
  tags: optional(pipe(array(string()), maxLength(5), uniqueItems())),
});

export type NoRefs = InferOutput<typeof NoRefsSchema>;
