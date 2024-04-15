# Valibot i18n

The official i18n translations for Valibot. See the [internationalization guide](https://valibot.dev/guides/internationalization/) for more details.

## Current status

| Language        | Pull Request       | Status |
| --------------- | ------------------ | ------ |
| Chinese (zh-CN) | [#419][pr-419-url] | ✅     |
| Chinese (zh-TW) | [#427][pr-427-url] | ✅     |
| Dutch (nl)      | [#438][pr-438-url] | ✅     |
| English (en)    | [#397][pr-397-url] | ✅     |
| German (de)     | [#397][pr-397-url] | ✅     |
| French (fr)     | [#418][pr-418-url] | ✅     |
| Japanese (ja)   | [#431][pr-431-url] | ✅     |
| Korean (kr)     | [#429][pr-429-url] | ✅     |
| Norwegian (nb)  | [#439][pr-439-url] | ✅     |
| Portuguese (pt) | [#509][pr-509-url] | ✅     |
| Romanian (ro)   | [#472][pr-472-url] | ✅     |
| Russian (ru)    | [#434][pr-434-url] | ✅     |
| Slovenian (sl)  | [#422][pr-422-url] | ✅     |
| Ukrainian (uk)  | [#423][pr-423-url] | ✅     |
| Arabic (ar)     | [#527][pr-527-url] | ✅     |

[pr-397-url]: https://github.com/fabian-hiller/valibot/pull/397
[pr-418-url]: https://github.com/fabian-hiller/valibot/pull/418
[pr-419-url]: https://github.com/fabian-hiller/valibot/pull/419
[pr-422-url]: https://github.com/fabian-hiller/valibot/pull/422
[pr-423-url]: https://github.com/fabian-hiller/valibot/pull/423
[pr-427-url]: https://github.com/fabian-hiller/valibot/pull/427
[pr-429-url]: https://github.com/fabian-hiller/valibot/pull/429
[pr-431-url]: https://github.com/fabian-hiller/valibot/pull/431
[pr-434-url]: https://github.com/fabian-hiller/valibot/pull/434
[pr-438-url]: https://github.com/fabian-hiller/valibot/pull/438
[pr-439-url]: https://github.com/fabian-hiller/valibot/pull/439
[pr-472-url]: https://github.com/fabian-hiller/valibot/pull/472
[pr-509-url]: https://github.com/fabian-hiller/valibot/pull/509
[pr-527-url]: https://github.com/fabian-hiller/valibot/pull/527

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
