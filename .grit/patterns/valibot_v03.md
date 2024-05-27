# Valibot v0.31 Upgrade

In v0.31, the API was changed to use a `v.pipe` method.

```grit
language js

pattern vb_schema() {
  or {
    `any`,
    `array`, `bigint`, `blob`, `boolean`, `custom`, `date`, `enum_`, `instance`, `intersect`, `lazy`, `literal`, `looseObject`, `looseTuple`, `map`, `nan`, `never`, `nonNullable`, `nonNullish`, `nonOptional`, `null_`, `nullable`, `nullish`, `number`, `object`, `objectWithRest`, `optional`, `picklist`, `record`, `set`, `strictObject`, `strictTuple`, `string`, `symbol`, `tuple`, `tupleWithRest`, `undefined_`, `union`, `unknown`, `variant`, `void_`
  }
}

pattern vb_renames() {
  or {
    `custom` => `check`,
    `BaseSchema` => `GenericSchema`,
    `Input` => `InferInput`,
    `Output` => `InferOutput`,
    `SchemaConfig` => `Config`,
    `special` => `custom`,
    `toCustom` => `transform`,
    `toTrimmed` => `trim`,
    `toTrimmedEnd` => `trimEnd`,
    `toTrimmedStart` => `trimStart`
  }
}

/// These schemas have a mandatory first arg, so should only be piped if there are other arguments
pattern vb_schemas_with_mandatory_arg() {
  or {
    `union`,
    `intersect`,
    `tuple`,
    `picklist`
  }
}

pattern vb_pipe_schema_args($schema, $new_schema_args, $piped_args) {
  or {
    [$maybe_pipe] where $other_args = [],
    [$one_arg, $maybe_pipe] where $other_args = [$one_arg],
    [$one_arg, $two_arg, $maybe_pipe] where $other_args = [$one_arg, $two_arg],
    [$one_arg, $two_arg, $three_arg, $maybe_pipe] where $other_args = [$one_arg, $two_arg, $three_arg]
  } where {
    $maybe_pipe <: `[$piped_args]` where {
      or {
        $schema <: not vb_schemas_with_mandatory_arg(),
        // If it is a union, then there must be a second argument
        and {
          $schema <: vb_schemas_with_mandatory_arg(),
          $one_arg <: not undefined
        }
      }
    },
    $new_schema_args = join($other_args, `,`)
  }
}

pattern vb_pipe($v) {
  or {
    `$v.$schema($schema_args)` where {
      $schema <: vb_schema(),
      $schema_args <: vb_pipe_schema_args($schema, $new_schema_args, $piped_args)
    } => `$v.pipe($v.$schema($new_schema_args), $piped_args)`,
    `$schema($schema_args)` where {
      $schema <: vb_schema(),
      $schema_args <: vb_pipe_schema_args($schema, $new_schema_args, $piped_args),
      add_import(`pipe`, `'valibot'`)
    } => `pipe($schema($new_schema_args), $piped_args)`
  }
}

pattern vb_coerce($v) {
  `$v.coerce($schema, $fn)` => `$v.pipe($v.unknown(), $v.transform($fn))`
}

pattern vb_flatten($v) {
  `$flatten($error)`  => `$flatten($error.issues)` where {
    $error <: identifier(),
    $flatten <: or {
      `flatten`,
      `$v.flatten`
    }
  }
}

any {
  vb_renames(),
  vb_pipe($v),
  vb_coerce($v),
  vb_flatten($v)
} where {
  $v <: or {
    undefined,
    // just assume `v` is valibot
    `v`,
    // or any other wildcard import
    identifier() where $program <: contains `import * as $v from 'valibot'`
  }
}
```

You can use [Grit](https://docs.grit.io/cli/quickstart) to automatically update your code to the new API. The migration is done entirely locally.

## Restructure code

The biggest change in v0.31 is the restructuring of the code around a new `v.pipe` method that is used to chain together validators.

Before:
```javascript
const Schema = v.string([v.email()]);
```

After:
```javascript
const Schema = v.pipe(v.string(), v.email());
```

## Nested pipe

The `v.pipe` method only needs to be used once, even when nesting validators.

Before:
```javascript
const Schema = v.map(
  v.number(),
  v.string([v.url(), v.endsWith('@example.com')]),
  [v.maxSize(10)]
);
```

After:
```javascript
const Schema = v.pipe(v.map(v.number(),v.pipe(v.string(), v.url(), v.endsWith('@example.com'))), v.maxSize(10));
```

## Union without pipe

`intersect` and `union` are not necessarily piped.

```js
const Schema = v.object({
  email: v.string([v.email(), v.endsWith('@gmail.com')]),
  password: v.string([v.minLength(8)]),
  other: v.union([v.string([v.decimal()]), v.number()]),
  intersection: v.intersect([v.string(), v.number()])
});
```

```js
const Schema = v.object({
  email: v.pipe(v.string(), v.email(), v.endsWith('@gmail.com')),
  password: v.pipe(v.string(), v.minLength(8)),
  other: v.union([v.pipe(v.string(), v.decimal()), v.number()]),
  intersection: v.intersect([v.string(), v.number()])
});
```


## Nested pipe with union

Union arguments are not a pipe.

```js
const Schema = v.object({
  email: v.string([v.email(), v.endsWith('@gmail.com')]),
  password: v.string([v.minLength(8)]),
  other: v.union([v.string([v.decimal()]), v.number()]),
  unionPipe: v.union([v.string(), v.number()], [v.minLength(8)]),
  intersectionPipe: v.intersect([v.string(), v.number()], [v.minLength(8)]),
});
```

```js
const Schema = v.object({
  email: v.pipe(v.string(), v.email(), v.endsWith('@gmail.com')),
  password: v.pipe(v.string(), v.minLength(8)),
  other: v.union([v.pipe(v.string(), v.decimal()), v.number()]),
  unionPipe: v.pipe(v.union([v.string(), v.number()]), v.minLength(8)),
  intersectionPipe: v.pipe(v.intersect([v.string(), v.number()]), v.minLength(8)),
});
```

## Coerce method

The coerce method has been removed, in favor of more explicit type transformations.

Before:
```javascript
const DateSchema = v.coerce(v.date(), (input) => new Date(input));
```

After:
```javascript
const DateSchema = v.pipe(v.unknown(), v.transform((input) => new Date(input)));
```

## Flatten issues

Previously, the flatten function accepted a ValiError or an array of issues. Now an array of issues must be passed.

Before:
```js
const flatErrors = v.flatten(error);

// This is unchanged:
const flatErrors = v.flatten([issues]);
```

After:
```js
const flatErrors = v.flatten(error.issues);

// This is unchanged:
const flatErrors = v.flatten([issues]);
```

## Alternative import name

It will detect other wildcard imports too.

```js
import * as foo from 'valibot';

import * as notFoo from 'zod';

const Schema = foo.string([foo.email()]);

const Schema2 = notFoo.string([notFoo.email()]);
```

```js
import * as foo from 'valibot';

import * as notFoo from 'zod';

const Schema = foo.pipe(foo.string(), foo.email());

const Schema2 = notFoo.string([notFoo.email()]);
```

## Direct imports

Imports from `valibot` are also supported.

```js
import { string, email, flatten } from 'valibot';

const schemaWithPipe = string([email()]);

const flatErrors = flatten(error);
```

```js
import { string, email, flatten, pipe } from 'valibot';

const schemaWithPipe = pipe(string(), email());

const flatErrors = flatten(error.issues);
```

## Brand