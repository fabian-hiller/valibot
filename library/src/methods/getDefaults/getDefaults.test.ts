import { describe, expect, test } from 'vitest';
import {getDefaults} from './getDefaults.ts';
import {number, object, optional, string} from '../../schemas';
import {fallback} from '../fallback';

describe('getDefaults', () => {
    test('should derive correct default object', () => {
        expect(getDefaults(object({}))).toStrictEqual({})

        expect(getDefaults(object({
            name: string()
        }))).toStrictEqual({name: undefined})

        expect(getDefaults(object({
            name: fallback(string(), 'Valibot')
        }))).toStrictEqual({name: 'Valibot'})

        expect(getDefaults(object({
            name: optional(string(), 'Valibot')
        }))).toStrictEqual({name: 'Valibot'})

        expect(getDefaults(object({
            name: optional(string(), 'Valibot'),
            age: number()
        }))).toStrictEqual({name: 'Valibot', age: undefined})

        expect(getDefaults(object({
            name: optional(string(), 'Valibot'),
            age: optional(number(), 42)
        }))).toStrictEqual({name: 'Valibot', age: 42})

        expect(getDefaults(object({
            name: optional(string(), 'Valibot'),
            age: fallback(number(), 42)
        }))).toStrictEqual({name: 'Valibot', age: 42})

        expect(getDefaults(object({
            name: optional(string(), 'Valibot'),
            info: object({
                age: fallback(number(), 42),
                location: string()
            })
        }))).toStrictEqual({name: 'Valibot', info: undefined})

        expect(getDefaults(object({
            name: optional(string(), 'Valibot'),
            info: fallback(object({
                age: number(),
                location: string()
            }), {age: 42, location: 'Universe'})
        }))).toStrictEqual({name: 'Valibot', info: {age: 42, location: 'Universe'}})
    })
})