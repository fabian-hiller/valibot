import { CheckItemsAction, InferOutput, array, boolean, checkItems, isoDate, isoDateTime, literal, maxLength, maxValue, minLength, minValue, multipleOf, number, object, optional, pipe, regex, string, union, uuid } from "valibot";


const uniqueItems = <Type, Message extends string>(
  message?: Message
): CheckItemsAction<Type[], Message | undefined> =>
  checkItems((item, i, arr) => arr.indexOf(item) === i, message);


export const SharedComponentSchema = object({
  sharedId: pipe(string(), uuid()),
  category: union([
    literal('Type A'),
    literal('Type B'),
    literal('Type C'),
  ]),
  validityPeriod: optional(pipe(number(), minValue(30), maxValue(365))),
  isPublic: optional(boolean()),
  metadata: optional(object({
    version: pipe(string(), regex(/^\d+\.\d+\.\d+$/)),
    owner: optional(string()),
    description: optional(pipe(string(), maxLength(500))),
  })),
  scores: optional(pipe(array(pipe(number(), minValue(0), maxValue(10))), minLength(3), maxLength(10))),
  tags: optional(pipe(array(string()), uniqueItems())),
});

export type SharedComponent = InferOutput<typeof SharedComponentSchema>;


export const MainComponent1Schema = object({
  id: pipe(string(), uuid()),
  name: pipe(string(), minLength(3), maxLength(50), regex(/^[A-Za-z0-9\s]+$/)),
  requiredCount: optional(pipe(number(), minValue(1), maxValue(100))),
  isActive: optional(boolean()),
  tags: optional(pipe(array(string()), minLength(1), maxLength(10), uniqueItems())),
  decimalValue: optional(pipe(number(), minValue(0.1), maxValue(99.9), multipleOf(0.1))),
  sharedData: SharedComponentSchema,
  createdAt: optional(pipe(string(), isoDateTime())),
});

export type MainComponent1 = InferOutput<typeof MainComponent1Schema>;


export const MainComponent2Schema = object({
  code: pipe(string(), minLength(5), maxLength(10)),
  priority: optional(union([
    literal(1),
    literal(2),
    literal(3),
    literal(5),
    literal(8),
  ])),
  floatRange: optional(pipe(number(), minValue(1), maxValue(9))),
  options: optional(pipe(array(object({
    optionId: string(),
    optionValue: boolean(),
  })), maxLength(5))),
  enabledFeatures: optional(array(union([
    literal('feature1'),
    literal('feature2'),
    literal('feature3'),
  ]))),
  statusHistory: optional(object({})),
  sharedData: SharedComponentSchema,
  lastUpdated: optional(pipe(string(), isoDate())),
});

export type MainComponent2 = InferOutput<typeof MainComponent2Schema>;
