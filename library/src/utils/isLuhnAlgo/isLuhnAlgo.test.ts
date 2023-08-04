import { describe, expect, test } from 'vitest';
import { isLuhnAlgo } from './isLuhnAlgo.ts';

describe('isLuhnAlgo', () => {
  test('should return correct boolean', () => {
    expect(isLuhnAlgo('536498459191226')).toBe(true);
    expect(isLuhnAlgo('860548042618881')).toBe(true);
    expect(isLuhnAlgo('304517506893326')).toBe(true);
    expect(isLuhnAlgo('378282246310005')).toBe(true);
    expect(isLuhnAlgo('6011000990139424')).toBe(true);
    expect(isLuhnAlgo('7238493252455')).toBe(true);
    expect(isLuhnAlgo('8924578427422')).toBe(true);

    expect(isLuhnAlgo('53649845919122')).toBe(false);
    expect(isLuhnAlgo('5146713835430')).toBe(false);
    expect(isLuhnAlgo('72348235235')).toBe(false);
    expect(isLuhnAlgo('83793719357')).toBe(false);
    expect(isLuhnAlgo('892457842742223')).toBe(false);
  });
});
