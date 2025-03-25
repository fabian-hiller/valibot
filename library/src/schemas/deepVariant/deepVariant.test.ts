import { describe, expect, test } from "vitest";
import { deepVariant } from "./deepVariant";
import { object } from "../object";
import { literal } from "../literal";
import { number } from "../number";
import { parse } from "../../methods";
import { matchVariation } from "./matcher";

describe("deepVariant", () => {
  test("abc", () =>{
    const NodeSchema = deepVariant('node.type', [
      object({
        node: object({
          type: literal("string")
        }),
        data: object({ minLength: number(), maxLength: number() })
      }),
      object({
        node: object({
          type: literal("number")
        }),
        data: object({ minValue: number(), maxValue: number() })
      })
    ]);

    const data = parse(NodeSchema, {
      type: "number",
      node: {
        type: "number"
      },
      data: {
        minValue: 5,
        maxValue: 5
      }
    });

    matchVariation(data, "node.type", {
      number(data) {
        console.log("It's a number!", {data});
      },
      string(data) {
        console.log("It's a string!", {data});
      }
    });

  })
})