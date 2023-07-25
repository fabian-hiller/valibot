![Valibot Logo](https://github.com/fabian-hiller/valibot/blob/main/valibot.jpg?raw=true)

## 🏃 Get started

Hey 👋 I'm Valibot and I'm here to help you validate your data using schemas. It doesn't matter if you're dealing with incoming data on a server or validating a form directly in your browser. My modular design allows your bundler to remove everything that is not needed. This reduces the bundle size and improves performance. Since I'm fully implemented in TypeScript, you can enjoy maximum type safety with me. If you want to learn more about my benefits and differences from other solutions, I recommend you to read my [official announcement](https://www.builder.io/blog/introducing-valibot).

> If you are an author of a library or framework and want to integrate me with an adapter, you can call me Vali.

### ✨ Highlights

- Fully type safe with static type inference
- Small bundle size starting at less than 300 bytes
- Validate everything from strings to complex objects
- Open source and fully tested with 100 % coverage
- Many transformation and valdiation helpers included
- Well structured source code without dependencies
- Minimal, readable and well thought out API

### 🔩 Installation

Add me to your project with a single command via your favorite package manager.

```bash
npm install valibot
```

### 🙌 Credits

My friend [Fabian](https://github.com/fabian-hiller) created me as part of his bachelor thesis at [Stuttgart Media University](https://www.hdm-stuttgart.de/en/), supervised by Walter Kriha, [Miško Hevery](https://github.com/mhevery) and [Ryan Carniato](https://github.com/ryansolid). My role models also include [Colin McDonnell](https://github.com/colinhacks), who had a big influence on my API design with [Zod](https://github.com/colinhacks/zod).

### 🗝 License

I am completely free and licensed under the [MIT license](https://github.com/fabian-hiller/valibot/blob/main/LICENSE.md). But if you like, you can feed me with a star on GitHub.

## 🧱 Main concepts

Let's not waste time and validate the first data together. 🤖

### 🎨 Create a schema

You can create schemas for almost all data types and objects that TypeScript comes with. From primitive values like `number` and `null` to complex objects like `Map` and `Set` as well as special types like `enum`, `tuple` and `union` are all supported.

#### 📄 String schema

To create a string schema, use the `string` function. For almost all schema functions, you can pass a validation and transformation pipeline in the form of an array as the last optional argument to perform more detailed validations.

```ts
import { email, endsWith, string, toTrimmed } from 'valibot';

const EmailSchema = string([toTrimmed(), email(), endsWith('@example.com')]);
```

To further customize the schema, as well as the validation functions, you can usually pass an individual error message as a string as the first optional argument.

```ts
import { email, endsWith, string, toTrimmed } from 'valibot';

const EmailSchema = string('Value is not a string.', [
  toTrimmed(),
  email('The email is badly formatted.'),
  endsWith('@example.com', 'Only example emails are allowed.'),
]);
```

> Tip: Use the auto-complete feature of your editor to import the individual functions automatically.

#### 📂 Object schema

For object schemas you use the `object` function. As first argument you define the structure of your object.

```ts
import { email, minLength, object, string } from 'valibot';

const LoginSchema = object({
  email: string([email()]),
  password: string([minLength(8)]),
});
```

Using various functions, you can make the values of your object optional or merge two objects together, just like with types in TypeScript.

```ts
import {
  email,
  enumType,
  merge,
  minLength,
  object,
  partial,
  string,
  url,
} from 'valibot';

const LoginSchema = object({
  email: string([email()]),
  password: string([minLength(8)]),
});

const AccountSchema = merge([
  LoginSchema,
  partial(
    object({
      username: string([minLength(3)]),
      imageUrl: string([url()]),
      theme: enumType(['light', 'dark']),
    })
  ),
]);
```

#### 🧩 More schemas

My code is well structured and fully commented. Until the [official documentation](https://valibot.dev/) is complete, you can just click through the GitHub repository to create other schemas.

### 🕵️ Infer types

To make your day even easier, you can extract the input and output type of a schema. The input and output will only be different if you use `transform` to transform the data after validation. In most cases, only the output will be of interest to you.

```ts
import { type Output, email, minLength, object, string } from 'valibot';

const LoginSchema = object({
  email: string([email()]),
  password: string([minLength(8)]),
});

type LoginData = Output<typeof LoginSchema>; // { email: string; password: string }
```

### 🏁 Parse data

To check if unknown data matches your schema, use the `parse` method. Alternatively, I also support asynchronous validation with `parseAsync` and if you don't want errors to be thrown, you can use `parseSafe` or `parseSafeAsync`.

```ts
import { email, endsWith, parse, string } from 'valibot';

const EmailSchema = string([email(), endsWith('@example.com')]);

parse(EmailSchema, null); // throws error
parse(EmailSchema, 'foo'); // throws error

parse(EmailSchema, 'jane@example.com'); // returns 'jane@example.com'
```

## ⚡️ What's next?

With the release of v0.1, early adopters and content creators can try me out and evaluate me. Until v1 I reserve the right to make major changes to the API. Please create [issues](https://github.com/fabian-hiller/valibot/issues/new) and PRs if you encounter problems or have ideas for improvements.

As part of this project, I will also be releasing detailed [documentation](https://valibot.dev/) over the next few weeks, which will be expanded and improved piece by piece.
