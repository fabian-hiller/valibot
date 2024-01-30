import { describe, expect, test } from 'vitest';
import { email } from './email.ts';

describe('email', () => {
  describe('should return action object', () => {
    test('should contain the default message', () => {
      expect(email()).toMatchObject({
        type: 'email',
        async: false,
        message: 'Invalid email',
        requirement: expect.any(RegExp),
        _parse: expect.any(Function),
      });
    });

    test('should contain the message argument', () => {
      const message = 'Custom message';
      expect(email(message)).toMatchObject({
        type: 'email',
        async: false,
        message: message,
        requirement: expect.any(RegExp),
        _parse: expect.any(Function),
      });
    });
  });

  describe('should return action output', () => {
    test('should pass standard email', () => {
      const value = 'email@example.com';
      expect(email()._parse(value)).toEqual({ output: value });
    });

    test('should pass email with country code top level domain', () => {
      const value = 'email@example.co.uk';
      expect(email()._parse(value)).toEqual({ output: value });
    });

    test('should pass email with dot in local part', () => {
      const value = 'firstname.lastname@example.com';
      expect(email()._parse(value)).toEqual({ output: value });
    });

    test('should pass email with hyphen in local part', () => {
      const value = 'firstname-lastname@example.com';
      expect(email()._parse(value)).toEqual({ output: value });
    });

    test('should pass email with plus in local part', () => {
      const value = 'firstname+lastname@example.com';
      expect(email()._parse(value)).toEqual({ output: value });
    });

    test('should pass email with plus in end of local part', () => {
      const value = 'email+@example.com';
      expect(email()._parse(value)).toEqual({ output: value });
    });

    test('should pass email with plus in begining of local part', () => {
      const value = '+email@example.com';
      expect(email()._parse(value)).toEqual({ output: value });
    });

    test('should pass email with hyphen in domain part', () => {
      const value = 'email@aaa-bbb.com';
      expect(email()._parse(value)).toEqual({ output: value });
    });

    test('should pass email with long top level domain', () => {
      const value = 'email@example.technology';
      expect(email()._parse(value)).toEqual({ output: value });
    });

    test('should pass email with numerical local part', () => {
      const value = '1234567890@example.com';
      expect(email()._parse(value)).toEqual({ output: value });
    });

    test('should pass email with numerical local part', () => {
      const value = '1234567890@example.com';
      expect(email()._parse(value)).toEqual({ output: value });
    });

    test('should pass email with subdomain', () => {
      const value = 'email@subdomain.example.com';
      expect(email()._parse(value)).toEqual({ output: value });
    });

    test('should pass email with subdomain and hyphen in domain', () => {
      const value = 'email@subdomain.aaa-bbb.com';
      expect(email()._parse(value)).toEqual({ output: value });
    });

    test('should pass email with subdomain and country code top level domain', () => {
      const value = 'email@subdomain.example.co.uk';
      expect(email()._parse(value)).toEqual({ output: value });
    });

    test('should pass email with short domain and top level domain', () => {
      const value = 'email@ab.cd';
      expect(email()._parse(value)).toEqual({ output: value });
    });

    test('should pass email with numeric domain and top level domain', () => {
      const value = 'email@123.com';
      expect(email()._parse(value)).toEqual({ output: value });
    });
  });

  describe('should return action issue', () => {
    test('should reject email with missing @ symbol', () => {
      const value = 'example.com';
      expect(email()._parse(value).issues).toBeTruthy();
    });

    test('should reject email with missing domain', () => {
      const value = 'email@.com';
      expect(email()._parse(value).issues).toBeTruthy();
    });

    test('should reject email with special chars in top level domain', () => {
      const value = '#@%^%#$@#$@#.com';
      expect(email()._parse(value).issues).toBeTruthy();
    });

    test('should reject email with no top-level domain', () => {
      const value = 'email@example';
      expect(email()._parse(value).issues).toBeTruthy();
    });

    test('should reject email with numeric top-level domain', () => {
      const value = 'email@example.123';
      expect(email()._parse(value).issues).toBeTruthy();
    });

    test('should reject email with only domain', () => {
      const value = '@example.com';
      expect(email()._parse(value).issues).toBeTruthy();
    });

    test('should reject email with only local part', () => {
      const value = 'email@';
      expect(email()._parse(value).issues).toBeTruthy();
    });

    test('should reject email with spaces', () => {
      const value = ' email@example.com ';
      expect(email()._parse(value).issues).toBeTruthy();
    });

    test('should reject email with multiple @ symbols', () => {
      const value = ' email@@example.com ';
      expect(email()._parse(value).issues).toBeTruthy();
    });

    test('should reject email where domain consists from numerical values', () => {
      const value = 'email@111.222.333.44444';
      expect(email()._parse(value).issues).toBeTruthy();
    });

    test('should reject email where local part consists of non ASCII chars', () => {
      const value = 'あいうえお@example.com';
      expect(email()._parse(value).issues).toBeTruthy();
    });

    test('should reject email where local part begin with dot', () => {
      const value = '.email@example.com';
      expect(email()._parse(value).issues).toBeTruthy();
    });

    test('should reject email where local part end with special char', () => {
      const value = 'email.@example.com';
      expect(email()._parse(value).issues).toBeTruthy();
    });

    test('should reject email where domain part end with special char', () => {
      const value = 'email@-example.com';
      expect(email()._parse(value).issues).toBeTruthy();
    });

    test('should reject email where domain part end with special char', () => {
      const value = 'email@example-.com';
      expect(email()._parse(value).issues).toBeTruthy();
    });

    test('should reject email where two dots separate in local part', () => {
      const value = 'email..email@example.com';
      expect(email()._parse(value).issues).toBeTruthy();
    });

    test('should reject email where name is represented in front of email', () => {
      const value = 'Joe Smith <email@example.com>';
      expect(email()._parse(value).issues).toBeTruthy();
    });

    test('should reject email where name is represented after email', () => {
      const value = 'email@example.com (Joe Smith)';
      expect(email()._parse(value).issues).toBeTruthy();
    });
  });
});
