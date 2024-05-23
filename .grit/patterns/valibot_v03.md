# Valibot v0.31 Upgrade

In v0.31, the API was changed to use a `v.pipe` method.

```grit

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

```

## Restructure code

The biggest change in v0.31 is the restructuring of the code. The `v.pipe` method is now used to chain together validators.

Before:
```javascript
const Schema = v.string([v.email()]);
```

After:
```javascript
const Schema = v.pipe(v.string(), v.email()));
```

## Coerce method

The coerce method has been removed, in favor of more explicit type transformations.

Before:
```javascript
const DateSchema = v.coerce(v.date(), (input) => new Date(input));
```

After:
```javascript
const DateSchema = v.pipe(
  v.union([v.string(), v.number()]),
  v.transform((input) => new Date(input))
);
```