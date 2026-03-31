import { describe, it, expect } from 'vitest';

import { arrayToNestedObject, nestedObjectToArray, normalizeToFlatKV } from './KVInputHelper';

describe('KVInputHelper', () => {
  describe('arrayToNestedObject', () => {
    it('should convert simple array to object', () => {
      const input = [['key', 'value']];
      expect(arrayToNestedObject(input)).toEqual({ key: 'value' });
    });

    it('should handle nested arrays', () => {
      const input = [['a', 'b', 'c']];
      expect(arrayToNestedObject(input)).toEqual({
        a: { b: 'c' }
      });
    });

    it('should handle deep nesting', () => {
      const input = [['a', 'b', 'c', 'd']];
      expect(arrayToNestedObject(input)).toEqual({
        a: { b: { c: 'd' } }
      });
    });

    it('should merge multiple paths', () => {
      const input = [
        ['a', 'b', '1'],
        ['a', 'c', '2']
      ];
      expect(arrayToNestedObject(input)).toEqual({
        a: { b: '1', c: '2' }
      });
    });

    it('should overwrite existing values', () => {
      const input = [
        ['a', 'b', '1'],
        ['a', 'b', '2']
      ];
      expect(arrayToNestedObject(input)).toEqual({ a: { b: '2' } });
    });

    it('should merge existing values from duplicated keys', () => {
      const input = [
        ['a', 'b', '1'],
        ['a', 'b', '2']
      ];

      expect(arrayToNestedObject(input, true)).toEqual({ a: { b: ['1', '2'] } });
    });

    it('should ignore invalid paths', () => {
      const input = [['onlykey']];
      expect(arrayToNestedObject(input)).toEqual({});
    });

    it('should handle dot notation', () => {
      const input = [['a.b', 'value']];
      expect(arrayToNestedObject(input)).toEqual({
        a: { b: 'value' }
      });
    });

    it('should handle deep dot notation', () => {
      const input = [['a.b.c', 'value']];
      expect(arrayToNestedObject(input)).toEqual({
        a: { b: { c: 'value' } }
      });
    });

    it('should mix dot and normal paths', () => {
      const input = [
        ['a.b', '1'],
        ['a', 'c', '2']
      ];
      expect(arrayToNestedObject(input)).toEqual({
        a: { b: '1', c: '2' }
      });
    });

    it('should not crash with empty array', () => {
      expect(arrayToNestedObject([])).toEqual({});
    });
  });

  describe('nestedObjectToArray', () => {
    it('should convert simple object to array', () => {
      const input = { key: 'value' };
      expect(nestedObjectToArray(input)).toEqual([['key', 'value']]);
    });

    it('should handle nested object', () => {
      const input = { a: { b: 'c' } };
      expect(nestedObjectToArray(input)).toEqual([['a', 'b', 'c']]);
    });

    it('should handle deep nesting', () => {
      const input = { a: { b: { c: 'd' } } };
      expect(nestedObjectToArray(input)).toEqual([['a', 'b', 'c', 'd']]);
    });

    it('should flatten multiple branches', () => {
      const input = { a: { b: '1', c: '2' } };
      expect(nestedObjectToArray(input)).toEqual([
        ['a', 'b', '1'],
        ['a', 'c', '2']
      ]);
    });

    it('should handle dot notation output', () => {
      const input = { a: { b: 'c' } };
      expect(nestedObjectToArray(input, [])).toEqual([['a.b', 'c']]);
    });

    it('should handle deep dot notation output', () => {
      const input = { a: { b: { c: 'd' } } };
      expect(nestedObjectToArray(input, [])).toEqual([['a.b.c', 'd']]);
    });

    it('should stringify values', () => {
      const input = { a: 123, b: true };
      expect(nestedObjectToArray(input)).toEqual([
        ['a', '123'],
        ['b', 'true']
      ]);
    });

    it('should handle empty object', () => {
      expect(nestedObjectToArray({})).toEqual([]);
    });

    it('should flatten arrays in values', () => {
      const input = { a: { b: ['1', '2'] } };
      expect(nestedObjectToArray(input)).toEqual([
        ['a', 'b', '1'],
        ['a', 'b', '2']
      ]);
    });

    it('should convert nested object with multiple branches', () => {
      const input = { a: { b: '1', c: '2' } };
      expect(nestedObjectToArray(input)).toEqual([
        ['a', 'b', '1'],
        ['a', 'c', '2']
      ]);
    });
  });

  describe('roundtrip', () => {
    it('should preserve structure (normal)', () => {
      const input = [
        ['a', 'b', '1'],
        ['a', 'c', '2']
      ];
      const obj = arrayToNestedObject(input);
      const back = nestedObjectToArray(obj);

      expect(back).toEqual(expect.arrayContaining(input));
    });

    it('should preserve structure (dot notation)', () => {
      const input = [
        ['a.b', '1'],
        ['a.c', '2']
      ];
      const obj = arrayToNestedObject(input);
      const back = nestedObjectToArray(obj, []);

      expect(back).toEqual(expect.arrayContaining(input));
    });
  });

  describe('normalizeToFlatKV', () => {
    it('should flatten simple 2-level arrays', () => {
      const input = [
        ['key1', 'value1'],
        ['key2', 'value2'],
        ['key3.subKey1', 'value3']
      ];
      expect(normalizeToFlatKV(input)).toEqual([
        ['key1', 'value1'],
        ['key2', 'value2'],
        ['key3.subKey1', 'value3']
      ]);
    });

    it('should convert nested arrays to dot notation', () => {
      const input = [
        ['key1', 'subKey1', '123'],
        ['key2', 'subKey2', '456']
      ];
      expect(normalizeToFlatKV(input)).toEqual([
        ['key1.subKey1', '123'],
        ['key2.subKey2', '456']
      ]);
    });

    it('should handle mixed depth arrays', () => {
      const input = [
        ['key1', 'value1'],
        ['key2', 'subKey2', '456'],
        ['key3', 'sub1', 'sub2', '789']
      ];
      expect(normalizeToFlatKV(input)).toEqual([
        ['key1', 'value1'],
        ['key2.subKey2', '456'],
        ['key3.sub1.sub2', '789']
      ]);
    });

    it('should ignore arrays with less than 2 elements', () => {
      const input = [['key1'], ['key2', 'value2']];
      expect(normalizeToFlatKV(input)).toEqual([['key2', 'value2']]);
    });

    it('should handle empty input', () => {
      expect(normalizeToFlatKV([])).toEqual([]);
    });

    it('should handle multiple nested levels with dots', () => {
      const input = [
        ['a', 'b', 'c', 'd'],
        ['x', 'y', 'z']
      ];
      expect(normalizeToFlatKV(input)).toEqual([
        ['a.b.c', 'd'],
        ['x.y', 'z']
      ]);
    });

    it('should flatten array values into multiple [key,value] entries', () => {
      const input = [
        ['a', 'b', ['1', '2']],
        ['c', 'd', '3']
      ];
      const result = normalizeToFlatKV(input);
      expect(result).toEqual([
        ['a.b', '1'],
        ['a.b', '2'],
        ['c.d', '3']
      ]);
    });
  });
});
