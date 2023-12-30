import { describe, expect, test } from 'vitest';
import { creditCard } from './creditCard.ts';

describe('creditCard', () => {
  test('should pass valid cards', () => {
    const validate = creditCard();

    const value1 = '4539 1488 0343 6467';
    expect(validate._parse(value1).output).toBe(value1);
    const value2 = '4539 1488 0343 6467';
    expect(validate._parse(value2).output).toBe(value2);
    const value3 = '5555 5555 5555 4444';
    expect(validate._parse(value3).output).toBe(value3);
    const value4 = '3714 4963 5398 431';
    expect(validate._parse(value4).output).toBe(value4);
    const value5 = '3530 1113 3330 0000';
    expect(validate._parse(value5).output).toBe(value5);
    const value6 = '4701 3222 1111 1234';
    expect(validate._parse(value6).output).toBe(value6);
    const value7 = '4001 9192 5753 7193';
    expect(validate._parse(value7).output).toBe(value7);
    const value8 = '4005 5500 0000 0001';
    expect(validate._parse(value8).output).toBe(value8);
    const value9 = '3020 4169 3226 43';
    expect(validate._parse(value9).output).toBe(value9);
    const value10 = '3021 8047 1965 57';
    expect(validate._parse(value10).output).toBe(value10);
    const value11 = '30218047196557';
    expect(validate._parse(value11).output).toBe(value11);
    const value12 = '4514 1639 2650 9685';
    expect(validate._parse(value12).output).toBe(value12);
    const value13 = '5041757714635542';
    expect(validate._parse(value13).output).toBe(value13);
    const value14 = '4011 1111 1111 1112';
    expect(validate._parse(value14).output).toBe(value14);
    const value15 = '4312 7410 0065 7175';
    expect(validate._parse(value15).output).toBe(value15);
    const value16 = '6277 8901 2345 6789';
    expect(validate._parse(value16).output).toBe(value16);
    const value17 = '6505 9883 4294 5980';
    expect(validate._parse(value17).output).toBe(value17);
    const value18 = '6505 5684 6905 0671';
    expect(validate._parse(value18).output).toBe(value18);
    const value19 = '5067 2147 8107 0269';
    expect(validate._parse(value19).output).toBe(value19);
    const value20 = '6509 4228 7282 0161';
    expect(validate._parse(value20).output).toBe(value20);
    const value21 = '6504 2498 1750 6596';
    expect(validate._parse(value21).output).toBe(value21);
    const value22 = '6363 6826 9764 9005';
    expect(validate._parse(value22).output).toBe(value22);

    expect(validate._parse('').issues).toBeTruthy();
    expect(validate._parse('1234 5678 9012 3456').issues).toBeTruthy();
    // TODO: add more tests to validate an invalid Elo cared
    expect(validate._parse('4011 1111 1111 1111').issues).toBeTruthy();
    expect(validate._parse('4312 7410 0065 7176').issues).toBeTruthy();
    expect(validate._parse('6277 8901 2345 6780').issues).toBeTruthy();
    expect(validate._parse('6505 9883 4294 5981').issues).toBeTruthy();
    expect(validate._parse('4532 7597 3454 2975 123').issues).toBeTruthy();
    expect(validate._parse('4532-8940-1234-5678').issues).toBeTruthy();
    expect(validate._parse('3543 0505 5555 5555').issues).toBeTruthy();
    expect(validate._parse('55555 5555 5555 4444').issues).toBeTruthy();
    expect(validate._parse('4111 1111 1111 111').issues).toBeTruthy();
    expect(validate._parse('abcd efgh ijkl mnop').issues).toBeTruthy();
    expect(validate._parse('0000 0000 0000 0000').issues).toBeTruthy();
  });

  test('should return custom error message', () => {
    const error = 'Value is not a valid credit card number!';
    const validate = creditCard(error);
    expect(validate._parse('').issues?.[0].message).toBe(error);
  });
});
