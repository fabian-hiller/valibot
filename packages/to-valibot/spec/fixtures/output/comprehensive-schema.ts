import { isoDateTime, minSize, pipe } from "valibot";
import { array, InferOutput, literal, union } from "valibot";
import { object, objectWithRest, string } from "valibot"

export const ComprehensiveSchema = object({
  simpleAdditionalProps: objectWithRest({}, string()),
  complexAdditionalProps: objectWithRest({
    id: string(),
  }, object({
    type: union([
      literal("user"),
      literal("admin"),
      literal("guest"),
    ]),
    permissions: array(string()),
    metadata: object({
      created: pipe(string(), isoDateTime())
    })
  })),
  limitedProperties: pipe(objectWithRest({}, string()), minProperties(2), maxProperties(5)),
  constantValue: literal("fixed-value-123"),
  formatStrings: object({

  }),
});
export type Comprehensive = InferOutput<typeof ComprehensiveSchema>;