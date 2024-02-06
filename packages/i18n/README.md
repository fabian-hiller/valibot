# Valibot i18n

The official i18n translations for Valibot.

| Language     | Pull Request | Status |
| ------------ | ------------ | ------ |
| English (en) | –            | ✅     |
| German (de)  | –            | ✅     |

## Getting started

Step 1: Clone repository

```bash
git clone git@github.com:fabian-hiller/valibot.git
```

Step 2: Install dependencies

```bash
pnpm install
```

Step 3: Build core library

```bash
cd ./library && pnpm build
```

Step 4: Change to directory

```bash
cd ../packages/i18n
```

## Add language

1. Add ISO code to `src/types.ts` in line 4
2. Duplicate `src/en.ts` and change file name to ISO code
3. Change ISO code and translate messages in new file
4. Import new language file in `scripts/build.ts`
5. Add new import to `languages` array

## Build library

Execute build script

```bash
pnpm build
```
