import { describe, expect, test } from 'vitest';
import { email } from './email.ts';

describe('email', () => {
  test('should pass only emails', () => {
    const validate = email();

    const value1 = 'email@example.com';
    expect(validate._parse(value1).output).toBe(value1);
    const value2 = '1234567890@example.com';
    expect(validate._parse(value2).output).toBe(value2);
    const value3 = '_______@example.com';
    expect(validate._parse(value3).output).toBe(value3);
    const value4 = 'firstname.lastname@example.com';
    expect(validate._parse(value4).output).toBe(value4);
    const value5 = 'firstname-lastname@example.com';
    expect(validate._parse(value5).output).toBe(value5);
    const value6 = 'firstname+lastname@example.com';
    expect(validate._parse(value6).output).toBe(value6);
    const value7 = 'email@aaa-bbb.com';
    expect(validate._parse(value7).output).toBe(value7);
    const value8 = 'email@example.name';
    expect(validate._parse(value8).output).toBe(value8);
    const value9 = 'email@example.co.uk';
    expect(validate._parse(value9).output).toBe(value9);
    const value10 = 'email@subdomain.example.com';
    expect(validate._parse(value10).output).toBe(value10);
    const value11 = 'email@subdomain.aaa-bbb.com';
    expect(validate._parse(value11).output).toBe(value11);
    const value12 = 'email@subdomain.example.co.uk';
    expect(validate._parse(value12).output).toBe(value12);

    expect(validate._parse('plainaddress').issues).toBeTruthy();
    expect(validate._parse('#@%^%#$@#$@#.com').issues).toBeTruthy();
    expect(validate._parse('@example.com').issues).toBeTruthy();
    expect(
      validate._parse('Joe Smith <email@example.com>').issues
    ).toBeTruthy();
    expect(validate._parse('email.example.com').issues).toBeTruthy();
    expect(validate._parse('email@example@example.com').issues).toBeTruthy();
    expect(validate._parse('.email@example.com').issues).toBeTruthy();
    expect(validate._parse('email.@example.com').issues).toBeTruthy();
    expect(validate._parse('email..email@example.com').issues).toBeTruthy();
    expect(validate._parse('あいうえお@example.com').issues).toBeTruthy();
    expect(
      validate._parse('email@example.com (Joe Smith)').issues
    ).toBeTruthy();
    expect(validate._parse('email@example').issues).toBeTruthy();
    expect(validate._parse('email@-example.com').issues).toBeTruthy();
    expect(validate._parse('email@example-.com').issues).toBeTruthy();
    expect(validate._parse('email@111.222.333.44444').issues).toBeTruthy();
    expect(validate._parse('email@example..com').issues).toBeTruthy();
    expect(validate._parse('Abc..123@example.com').issues).toBeTruthy();
  });

  test('should return custom error message', () => {
    const error = 'Value is not an email!';
    const validate = email(error);
    expect(validate._parse('test').issues?.[0].message).toBe(error);
  });
});
