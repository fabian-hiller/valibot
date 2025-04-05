import * as v from "valibot";

// TypeScript enum
enum Fruit {
	Orange,
	Apple = "apple",
	Banana = "banana",
}
const FruitEnum = v.enum(Fruit);
const value1: Fruit = v.parse(FruitEnum, "apple");

// object literal enum
const FruitObj = {
	Orange: 0,
	Apple: "apple",
	Banana: "banana",
} as const;
const FruitObjEnum = v.enum(FruitObj);
type FruitObjType = typeof FruitObj;
const value2: FruitObjType[keyof FruitObjType] = v.parse(FruitObjEnum, "apple");

// access underlying object using `enum` property
const FruitObjEnum2 = v.enum(FruitObj);
const apple: "apple" = FruitObjEnum2.enum.Apple;
