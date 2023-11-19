import { describe, expect, test } from 'vitest';
import { cuid2 } from './cuid2.ts';

describe('cuid2', () => {
  test('should pass only cuid2s', () => {
    const validate = cuid2();

    const value1 = 'o2dyrckf0vbqhftbcx8ex7r8';
    expect(validate._parse(value1).output).toBe(value1);
    const value2 = 'pj17j4wheabtydu00x2yuo8s';
    expect(validate._parse(value2).output).toBe(value2);
    const value3 = 'vkydd2qpoediyioixyeh8zyo';
    expect(validate._parse(value3).output).toBe(value3);
    const value4 = 'ja3j1arc87i80ys1zxk8iyiv';
    expect(validate._parse(value4).output).toBe(value4);
    const value5 = 'pbe6zw7wikj83vv5knjk1wx8';
    expect(validate._parse(value5).output).toBe(value5);

    expect(validate._parse('').issues).toBeTruthy();
    expect(validate._parse('w#@%^').issues).toBeTruthy();
    expect(validate._parse('o2dyrcKf0vbqhftBcx8ex7r8').issues).toBeTruthy();
    expect(validate._parse('1vx6pa5rqog2tqdztxaa0xgw').issues).toBeTruthy();
  });

  test('should return custom error message', () => {
    const error = 'Value is not an cuid2!';
    const validate = cuid2(error);
    expect(validate._parse('').issues?.[0].message).toBe(error);
  });
});
