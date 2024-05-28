Updates valibot from 0.30.0 to 0.31.0

[Run codemod](https://codemod.com/registry/valibot-upgrade-v0-31)

[See official guide](https://valibot.dev/guides/migrate-from-v0.30.0/)

## Examples

### Before

```ts
import * as v from "valibot";

v.object({
  email: v.string([v.email(), v.endsWith("@gmail.com")]),
  password: v.string([v.minLength(8)]),
  other: v.union([v.string([v.decimal()]), v.number()]),
});
```

### After

```ts
import * as v from "valibot";

v.object({
  email: v.pipe(v.string(), v.email(), v.endsWith("@gmail.com")),
  password: v.pipe(v.string(), v.minLength(8)),
  other: v.union([v.pipe(v.string(), v.decimal()), v.number()]),
});
```

### Before

```ts
import * as v from "valibot";
import { object, tuple } from "valibot";

const ObjectSchema = object({ key: v.string() }, v.null_());
const TupleSchema = tuple([v.string()], v.null_());
```

### After

```ts
import * as v from "valibot";
import { tupleWithRest, objectWithRest } from "valibot";

const ObjectSchema = objectWithRest({ key: v.string() }, v.null_());
const TupleSchema = tupleWithRest([v.string()], v.null_());
```

### Before

```ts
import * as v from "valibot";

const ObjectSchema1 = v.object({ foo: v.string() });
const ObjectSchema2 = v.object({ bar: v.number() });

const MergedObject = v.merge([ObjectSchema1, ObjectSchema2]);
```

### After

```ts
import * as v from "valibot";

const ObjectSchema1 = v.object({ foo: v.string() });
const ObjectSchema2 = v.object({ bar: v.number() });

const MergedObject = v.object({
  ...ObjectSchema1.entries,
  ...ObjectSchema2.entries,
});
```

### Before

```ts
import * as v from "valibot";

const BrandedSchema = v.brand(v.string(), "foo");
const TransformedSchema = v.transform(v.string(), (input) => input.length);
```

### After

```ts
import * as v from "valibot";

const BrandedSchema = v.pipe(v.string(), v.brand("foo"));
const TransformedSchema = v.pipe(
  v.string(),
  v.transform((input) => input.length),
);
```
