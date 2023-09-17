import { describe, expect, expectTypeOf, test } from 'vitest';
import { object, string } from '../../schemas/index.ts';
import type { Output } from '../../types.ts';
import { parse } from '../parse/index.ts';
import { brand, type Brand } from './brand.ts';

describe('brand', () => {
  test('should not affect parse', () => {
    const schema = brand(object({ key: string() }), 'test');
    const input = { key: 'hello' };
    const output = parse(schema, input);
    expect(output).toEqual(output);
  });

  test('should brand schema type', () => {
    const schema = object({ key: string() });
    const branded = brand(schema, 'test');
    type Branded = Output<typeof branded>;
    expectTypeOf(schema).not.toEqualTypeOf(branded);
    expectTypeOf<Branded>().toEqualTypeOf<{ key: string } & Brand<'test'>>();
  });

  test('should distinguish between brands', () => {
    const schema = string();
    const branded1 = brand(schema, '1');
    type Branded1 = Output<typeof branded1>;
    const branded2 = brand(schema, '2');
    type Branded2 = Output<typeof branded2>;
    expectTypeOf<Branded1>().not.toEqualTypeOf<Branded2>();
  });

  test('should allow multiple branding', () => {
    const branded1 = brand(string(), '1');
    type Branded1 = Output<typeof branded1>;
    const branded2 = brand(branded1, '2');
    type Branded2 = Output<typeof branded2>;

    expectTypeOf<Branded1>().not.toBeNever();
    expectTypeOf<Branded2>().not.toBeNever();

    expectTypeOf<Branded2>().toMatchTypeOf<Branded1>();
    expectTypeOf<Branded1>().not.toMatchTypeOf<Branded2>();

    expectTypeOf<Branded2>().toEqualTypeOf<string & Brand<'1'> & Brand<'2'>>();
    expectTypeOf<Branded2>().toMatchTypeOf<string & Brand<'1'>>();
  });

  test('should support brand hierarchy', () => {
    const id = brand(string(), 'Id');
    type BrandedId = Output<typeof id>;
    const userId = brand(id, 'UserId');
    type BrandedUserId = Output<typeof userId>;
    const postId = brand(id, 'PostId');
    type BrandedPostId = Output<typeof postId>;

    expectTypeOf<BrandedId>().not.toBeNever();
    expectTypeOf<BrandedUserId>().not.toBeNever();
    expectTypeOf<BrandedPostId>().not.toBeNever();

    expectTypeOf<BrandedUserId>().not.toMatchTypeOf<BrandedPostId>();
    expectTypeOf<BrandedPostId>().not.toMatchTypeOf<BrandedUserId>();
  });
});
