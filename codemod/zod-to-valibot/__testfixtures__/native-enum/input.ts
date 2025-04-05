import { z } from "zod";

// TypeScript enum
enum Fruit {
	Orange,
	Apple = "apple",
	Banana = "banana",
}
const FruitEnum = z.nativeEnum(Fruit);
const value1: Fruit = FruitEnum.parse("apple");

// object literal enum
const FruitObj = {
	Orange: 0,
	Apple: "apple",
	Banana: "banana",
} as const;
const FruitObjEnum = z.nativeEnum(FruitObj);
type FruitObjType = typeof FruitObj;
const value2: FruitObjType[keyof FruitObjType] = FruitObjEnum.parse("apple");

// access underlying object using `enum` property
const FruitObjEnum2 = z.nativeEnum(FruitObj);
const apple: "apple" = FruitObjEnum2.enum.Apple;
