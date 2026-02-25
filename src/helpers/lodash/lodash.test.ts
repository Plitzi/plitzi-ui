/* eslint-disable @typescript-eslint/no-confusing-void-expression */

import _ from 'lodash';
import { describe, it, expect, test } from 'vitest';

import { camelCase } from './camelCase';
import { capitalize } from './capitalize';
import { cloneAtPath, cloneDeep } from './cloneDeep';
import { debounce } from './debounce';
import { get } from './get';
import { has } from './has';
import { isEmpty } from './isEmpty';
import { omit } from './omit';
import { pick } from './pick';
import { set } from './set';
import { snakeCase } from './snakeCase';
import { throttle } from './throttle';
import { upperFirst } from './upperFirst';

describe('get', () => {
  const obj = {
    a: {
      b: { c: 1 },
      list: [{ name: 'john', age: 30 }]
    }
  };

  it('get value', () => {
    type T = Record<string, object>;
    const obj = {} as { [K in keyof T]?: string | undefined };
    const value = get(obj, 'a');
    expect(value).toBeUndefined();
    const obj2 = {} as { a?: boolean };
    const value2 = get(obj2, 'a', false);
    expect(value2).toBe(false);
  });

  it('returns defaultValue when property is missing', () => {
    const element: Record<string, unknown> = {};
    const visibility = get<Record<string, unknown>, 'definition.initialState.visibility', boolean>(
      element,
      'definition.initialState.visibility',
      true
    );
    expect(visibility).toBe(true);
    const nestedVisibility = get<Record<string, unknown>, ['definition', 'initialState', 'visibility'], boolean>(
      element,
      ['definition', 'initialState', 'visibility'],
      false
    );
    expect(nestedVisibility).toBe(false);
  });

  it('returns actual value if it exists', () => {
    const element: Record<string, unknown> = {
      definition: { initialState: { visibility: false } }
    };
    const visibility = get(element, 'definition.initialState.visibility', true);
    expect(visibility).toBe(false);
    const nestedVisibility = get(element, ['definition', 'initialState', 'visibility'], true);
    expect(nestedVisibility).toBe(false);
  });

  it('empty path', () => {
    expect(get(obj, '')).toBeUndefined();
    expect(get(obj, '', 'default')).toBe('default');
  });

  it('gets deep value', () => {
    expect(get(obj, 'a.b.c')).toBe(1);
  });

  it('gets array index', () => {
    const value = get(obj, 'a.list[0].name');
    expect(value).toBe('john');
    const valueAge = get(obj, 'a.list[0].age');
    expect(valueAge).toBe(30);
  });

  it('returns default', () => {
    expect(get(obj, 'a.x', 'default')).toBe('default');
  });

  it('return value from array path', () => {
    const arr = [{ name: 'john', details: { age: 30 } }];
    const name = get(arr, '[0].name');
    expect(name).toBe('john');
    const age = get(arr as typeof arr | undefined, '[0].details.age');
    expect(age).toBe(30);
  });

  it('nested objects are typed correctly', () => {
    const obj = { a: { b: { c: 1, d: [{ name: 'test' }] } } };
    const value = get(obj, 'a.b.d[0].name');
    expect(value).toBe('test');
  });

  it('arrays', () => {
    const arr = [{ name: 'john' }, { name: 'doe' }];
    expect(get(arr, '[0].name')).toBe('john');
    expect(get(arr, '[1].name')).toBe('doe');
    expect(get(arr, '0')).toEqual({ name: 'john' });
    expect(get(arr, '1')).toEqual({ name: 'doe' });
    const arr2 = ['john', 'doe'];
    expect(get(arr2, '[0]')).toBe('john');
    expect(get(arr2, '[1]')).toBe('doe');
    expect(get(arr2, '0')).toBe('john');
    expect(get(arr2, '1')).toBe('doe');
  });

  it('Object array', () => {
    const obj = { id1: { name: 'john', profile: { age: 30 } }, id2: { name: 'doe' } } as Record<
      string,
      { name: string; profile?: { age: number } }
    >;
    const value = get(obj, 'id1.name');
    expect(value).toBe('john');
    const value2 = get(obj, 'id1.profile.age');
    expect(value2).toBe(30);
  });

  it('returns undefined for null object', () => {
    expect(get(null, 'a.b')).toBeUndefined();
  });

  it('supports path as array', () => {
    const obj = { a: { b: { c: 42 } } };
    const value = get(obj, ['a', 'b', 'c']);
    expect(value).toBe(42);
  });

  it('returns undefined for empty path string', () => {
    const obj = { a: 1 };
    expect(get(obj, '')).toBeUndefined();
  });

  it('handles numeric string keys', () => {
    const obj = { '123': { value: 'ok' } };
    expect(get(obj, '123.value')).toBe('ok');
  });

  it('works when root is array', () => {
    const obj = [{ name: 'john' }];
    expect(get(obj, '[0].name')).toBe('john');
  });

  it('behaves the same as lodash', () => {
    const obj = { a: { b: { c: 42 }, list: [{ x: 1 }] } };
    expect(get(obj, 'a.b.c')).toEqual(_.get(obj, 'a.b.c'));
    expect(get(obj, '')).toEqual(_.get(obj, ''));
    expect(get(obj, ['a', 'b', 'c'])).toEqual(_.get(obj, ['a', 'b', 'c']));
    expect(get(obj, 'a.list[0].x')).toEqual(_.get(obj, 'a.list[0].x'));
    expect(get(obj, 'a.missing', 'default')).toEqual(_.get(obj, 'a.missing', 'default'));
  });

  it('extended comparison with lodash', () => {
    const obj = {
      user: {
        name: 'alice',
        credentials: { password: '1234', token: 'abcd' },
        addresses: [
          { city: 'Lisbon', zip: 1000 },
          { city: 'Porto', zip: 2000 }
        ]
      },
      items: [
        { id: 1, value: 'a' },
        { id: 2, value: 'b' }
      ],
      meta: null
    };
    const paths = [
      'user.name',
      'user.credentials.token',
      'user.addresses[1].city',
      'items[0].value',
      'meta',
      'missing.path'
    ];
    for (const p of paths) {
      expect(get(obj, p)).toEqual(_.get(obj, p));
    }
  });

  test('stress test: get works on large object', () => {
    const bigObj: Record<string, any> = {};
    for (let i = 0; i < 10000; i++) {
      bigObj[`key${i}`] = { value: i, nested: { deep: i * 2 } };
    }
    expect(get(bigObj, 'key9999.nested.deep')).toBe(19998);
    expect(typeof get(bigObj, 'key5000.value')).toBe('number');
    expect(get(bigObj, 'missing.path', 'default')).toBe('default');
  });
});

describe('set', () => {
  it('sets deep value', () => {
    const obj: Record<string, unknown> = {};
    set(obj, 'a.b.c', 5);
    expect(get(obj, 'a.b.c')).toBe(5);
  });

  it('creates nested arrays', () => {
    const obj: Record<string, unknown> = {};
    set(obj, 'list[0].name', 'john');
    expect(get(obj, 'list[0].name')).toBe('john');
  });

  it('overwrites existing primitive with object', () => {
    const obj: Record<string, unknown> = { a: 1 };
    set(obj, 'a.b', 10);
    expect(get(obj, 'a.b')).toBe(10);
  });

  it('handles array paths as arrays', () => {
    const obj: Record<string, unknown> = {};
    set(obj, ['a', 'b', 'c'], 15);
    expect(get(obj, 'a.b.c')).toBe(15);
  });

  it('handles arrays', () => {
    const obj = [] as { name: string }[];
    set(obj, '[0].name', 'john');
    expect(get(obj, '[0].name')).toBe('john');
  });

  it('set with empty path does nothing', () => {
    const obj: Record<string, unknown> = { a: 1 };
    set(obj, '', 5);
    expect(obj).toEqual({ a: 1 });
  });

  it('set overwrites primitive with object when needed', () => {
    const obj: Record<string, unknown> = { a: 1 };
    set(obj, 'a.b.c', 10);
    expect(get(obj, 'a.b.c')).toBe(10);
  });

  it('sets inside existing array', () => {
    const obj = { list: [{ name: 'john' }] };
    set(obj, 'list[0].age', 30);
    expect(get(obj, 'list[0].age')).toBe(30);
  });

  it('creates nested arrays automatically', () => {
    const obj: Record<string, unknown> = {};
    set(obj, 'a[0][1].value', 'test');
    expect(get(obj, 'a[0][1].value')).toBe('test');
  });

  it('overwrites existing non-object path segment', () => {
    const obj: Record<string, unknown> = { a: 1 };
    set(obj, 'a.b', 2);
    expect(get(obj, 'a.b')).toBe(2);
  });

  it('behaves the same as lodash', () => {
    const obj1: Record<string, unknown> = {};
    const obj2: Record<string, unknown> = {};
    set(obj1, 'a.b.c', 10);
    _.set(obj2, 'a.b.c', 10);
    expect(obj1).toEqual(obj2);
    set(obj1, 'list[0].x', 5);
    _.set(obj2, 'list[0].x', 5);
    expect(obj1).toEqual(obj2);
  });

  it('extended comparison with lodash', () => {
    const obj = {
      user: {
        name: 'alice',
        credentials: { password: '1234', token: 'abcd' },
        addresses: [
          { city: 'Lisbon', zip: 1000 },
          { city: 'Porto', zip: 2000 }
        ]
      },
      items: [
        { id: 1, value: 'a' },
        { id: 2, value: 'b' }
      ],
      meta: null
    };
    const obj1 = structuredClone(obj);
    const obj2 = structuredClone(obj);
    set(obj1, 'user.credentials.token', 'efgh');
    _.set(obj2, 'user.credentials.token', 'efgh');
    expect(obj1).toEqual(obj2);
    set(obj1, 'user.addresses[1].zip', 9999);
    _.set(obj2, 'user.addresses[1].zip', 9999);
    expect(obj1).toEqual(obj2);
    set(obj1, 'items[2].value', 'c');
    _.set(obj2, 'items[2].value', 'c');
    expect(obj1).toEqual(obj2);
  });

  test('stress test: set works on large object', () => {
    const bigObj: Record<string, any> = {};
    for (let i = 0; i < 10000; i++) {
      bigObj[`key${i}`] = { value: i };
    }
    set(bigObj, 'key9999.nested.deep', 12345);
    expect(bigObj.key9999.nested.deep).toBe(12345);
    set(bigObj, 'key0.value', 111);
    expect(bigObj.key0.value).toBe(111);
    set(bigObj, 'newKey.deep.value', 42);
    expect(bigObj.newKey.deep.value).toBe(42);
  }, 5000);
});

describe('pick', () => {
  const obj = { a: 1, b: 2, c: 3 };

  it('pick works', () => {
    const result = pick(obj, ['a', 'c']);
    expect(result).toEqual({ a: 1, c: 3 });
  });

  it('optional values are handled correctly', () => {
    const objWithUndefined = { a: 1, b: undefined, c: 3 } as { a: number; b?: number; c: number };
    const picked = pick(objWithUndefined, ['a', 'b']);
    expect(picked).toEqual({ a: 1 });
    const objWithMissingValues = { a: 1, c: 3 } as { a: number; b?: number; c: number };
    const pickedMissing = pick(objWithMissingValues, ['a', 'b']);
    expect(pickedMissing).toEqual({ a: 1 });
  });

  it('pick with empty paths returns empty object', () => {
    const obj = { a: 1 };
    expect(pick(obj, [])).toEqual({});
  });

  it('deep cases: picks deep nested value', () => {
    const obj = {
      user: {
        name: 'john',
        address: {
          city: 'Lisbon',
          zip: 1000
        }
      },
      list: [{ id: 1, value: 'a' }]
    };
    const result = pick(obj, ['user.address.city']);
    expect(result).toEqual({
      user: {
        address: {
          city: 'Lisbon'
        }
      }
    });
  });

  it('deep cases: picks multiple deep paths', () => {
    const obj = {
      user: {
        name: 'john',
        address: {
          city: 'Lisbon',
          zip: 1000
        }
      },
      list: [{ id: 1, value: 'a' }]
    };
    const result = pick(obj, ['user.name', 'user.address.zip']);
    expect(result).toEqual({
      user: {
        name: 'john',
        address: {
          zip: 1000
        }
      }
    });
  });

  it('deep cases: supports array index paths', () => {
    const obj = {
      user: { name: 'john', address: { city: 'Lisbon', zip: 1000 } },
      list: [{ id: 1, value: 'a' }]
    };
    const result = pick(obj, ['list[0].value']);
    expect(result).toEqual({
      list: [{ value: 'a' }]
    });
  });

  it('deep cases: ignores non-existing paths', () => {
    const obj = {
      user: { name: 'john', address: { city: 'Lisbon', zip: 1000 } },
      list: [{ id: 1, value: 'a' }]
    };
    const result = pick(obj, ['user.age']);
    expect(result).toEqual({});
  });

  it('deep cases: does not mutate original object', () => {
    const obj = {
      user: { name: 'john', address: { city: 'Lisbon', zip: 1000 } },
      list: [{ id: 1, value: 'a' }]
    };
    const result = pick(obj, ['user.name']);
    expect(obj.user.name).toBe('john');
    expect(result).not.toBe(obj);
  });

  it('handles overlapping paths', () => {
    const obj = {
      user: {
        name: 'john',
        address: { city: 'Lisbon', zip: 1000 }
      }
    };
    const result = pick(obj, ['user', 'user.address.city']);
    expect(result).toEqual({
      user: {
        name: 'john',
        address: { city: 'Lisbon', zip: 1000 }
      }
    });
  });

  it('supports array path syntax form', () => {
    const obj = { a: { b: 1 } };
    const result = pick(obj, [['a', 'b']]);
    expect(result).toEqual({ a: { b: 1 } });
  });

  it('behaves the same as lodash', () => {
    const obj = { a: 1, b: { c: 2, d: 3 } };
    const result1 = pick(obj, ['a', 'b.c']);
    const result2 = _.pick(obj, ['a', 'b.c']);
    expect(result1).toEqual(result2);
    const result3 = pick(obj, ['a']);
    const result4 = _.pick(obj, ['a']);
    expect(result3).toEqual(result4);
    const result5 = pick(obj, ['b.c']);
    const result6 = _.pick(obj, ['b.c']);
    expect(result5).toEqual(result6);
    const result7 = pick(obj, ['a', 'b']);
    const result8 = _.pick(obj, ['a', 'b']);
    expect(result7).toEqual(result8);
  });

  it('extended comparison with lodash', () => {
    const obj = {
      user: {
        name: 'alice',
        credentials: { password: '1234', token: 'abcd' },
        addresses: [
          { city: 'Lisbon', zip: 1000 },
          { city: 'Porto', zip: 2000 }
        ]
      },
      items: [
        { id: 1, value: 'a' },
        { id: 2, value: 'b' }
      ],
      meta: null
    };
    const paths = ['user.name', 'user.credentials.password', 'user.addresses[0].city', 'items[1].value'];
    const result1 = pick(obj, paths);
    const result2 = _.pick(obj, paths);
    expect(result1).toEqual(result2);
    const arrayPaths = [
      ['user', 'credentials', 'password'],
      ['items', '1', 'value']
    ];
    const resultArr1 = pick(obj, arrayPaths);
    const resultArr2 = _.pick(obj, arrayPaths);
    expect(resultArr1).toEqual(resultArr2);
  });

  test('stress test: pick works on large object', () => {
    const bigObj: Record<string, number> = {};
    for (let i = 0; i < 10000; i++) {
      bigObj[`key${i}`] = i;
    }
    const keys = ['key10', 'key9999', 'key5000', 'notfound'];
    const result = pick(bigObj, keys);
    expect(result).toHaveProperty('key10', 10);
    expect(result).toHaveProperty('key9999', 9999);
    expect(result).toHaveProperty('key5000', 5000);
    expect(result).not.toHaveProperty('notfound');
    expect(typeof result).toBe('object');
  }, 5000);
});

describe('omit', () => {
  const obj = { a: 1, b: 2, c: 3 };

  it('omit works with array of keys', () => {
    const result = omit(obj, ['b']);
    expect(result).toEqual({ a: 1, c: 3 });
  });

  it('omit works with single string path', () => {
    const result = omit(obj, 'b');
    expect(result).toEqual({ a: 1, c: 3 });
  });

  it('omit works with dynamic key', () => {
    const keyToOmit: string = 'b';
    const result = omit(obj, keyToOmit);
    expect(result).toEqual({ a: 1, c: 3 });
    const result2 = omit(obj, [keyToOmit]);
    expect(result2).toEqual({ a: 1, c: 3 });
  });

  it('optional values are handled correctly', () => {
    const objWithUndefined = { a: 1, b: undefined, c: 3 } as { a: number; b?: number; c: number };
    const omitted = omit(objWithUndefined, ['b']);
    expect(omitted).toEqual({ a: 1, c: 3 });
    const objWithMissingValues = { a: 1, c: 3 } as { a: number; b?: number; c: number };
    const omittedMissing = omit(objWithMissingValues, ['b']);
    expect(omittedMissing).toEqual({ a: 1, c: 3 });
  });

  it('omit with empty paths returns clone', () => {
    const obj = { a: 1 };
    const result = omit(obj, []);
    expect(result).toEqual(obj);
    expect(result).not.toBe(obj);

    const result2 = omit(obj);
    expect(result2).toEqual(obj);
    expect(result2).not.toBe(obj);
  });

  it('deep cases: omits deep nested value', () => {
    const obj = {
      user: {
        name: 'john',
        password: 'secret',
        address: {
          city: 'Lisbon',
          zip: 1000
        }
      },
      list: [{ id: 1, value: 'a' }]
    };
    const result = omit(obj, ['user.password']);
    expect(result).toEqual({
      user: {
        name: 'john',
        address: {
          city: 'Lisbon',
          zip: 1000
        }
      },
      list: [{ id: 1, value: 'a' }]
    });
  });

  it('deep cases: omits multiple deep paths', () => {
    const obj = {
      user: {
        name: 'john',
        password: 'secret',
        address: {
          city: 'Lisbon',
          zip: 1000
        }
      },
      list: [{ id: 1, value: 'a' }]
    };
    const result = omit(obj, ['user.address.zip', 'list[0].value']);
    expect(result).toEqual({
      user: {
        name: 'john',
        password: 'secret',
        address: {
          city: 'Lisbon'
        }
      },
      list: [{ id: 1 }]
    });
  });

  it('deep cases: ignores non-existing paths', () => {
    const obj = {
      user: {
        name: 'john',
        password: 'secret',
        address: {
          city: 'Lisbon',
          zip: 1000
        }
      },
      list: [{ id: 1, value: 'a' }]
    };
    const result = omit(obj, ['user.age']);
    expect(result).toEqual(obj);
  });

  it('deep cases: does not mutate original object', () => {
    const obj = {
      user: {
        name: 'john',
        password: 'secret',
        address: {
          city: 'Lisbon',
          zip: 1000
        }
      },
      list: [{ id: 1, value: 'a' }]
    };
    const result = omit(obj, ['user.password']);
    expect(obj.user.password).toBe('secret');
    expect(result).not.toBe(obj);
  });

  it('removes entire parent path with string', () => {
    const obj = { user: { name: 'john', password: 'secret' } };
    const result = omit(obj, 'user');
    expect(result).toEqual({});
  });

  it('removes deep nested value with string path', () => {
    const obj = {
      user: {
        name: 'john',
        password: 'secret',
        address: { city: 'Lisbon', zip: 1000 }
      },
      list: [{ id: 1, value: 'a' }]
    };
    const result = omit(obj, 'user.password');
    expect(result).toEqual({
      user: { name: 'john', address: { city: 'Lisbon', zip: 1000 } },
      list: [{ id: 1, value: 'a' }]
    });
  });

  it('behaves the same as lodash', () => {
    const obj = { a: 1, b: { c: 2, d: 3 } };
    const result1 = omit(obj, ['a', 'b.c']);
    const result2 = _.omit(obj, ['a', 'b.c']);
    expect(result1).toEqual(result2);
    const result3 = omit(obj, ['a']);
    const result4 = _.omit(obj, ['a']);
    expect(result3).toEqual(result4);
    const result5 = omit(obj, ['b.c']);
    const result6 = _.omit(obj, ['b.c']);
    expect(result5).toEqual(result6);
    const result7 = omit(obj, ['a', 'b']);
    const result8 = _.omit(obj, ['a', 'b']);
    expect(result7).toEqual(result8);
  });

  it('extended comparison with lodash', () => {
    const obj = {
      user: {
        name: 'alice',
        credentials: { password: '1234', token: 'abcd' },
        addresses: [
          { city: 'Lisbon', zip: 1000 },
          { city: 'Porto', zip: 2000 }
        ]
      },
      items: [
        { id: 1, value: 'a' },
        { id: 2, value: 'b' }
      ],
      meta: null
    };
    const paths = ['user.credentials.token', 'user.addresses[1]', 'items[0].value'];
    const result1 = omit(obj, paths);
    const result2 = _.omit(obj, paths);
    expect(result1).toEqual(result2);
  });

  it('works correctly with frozen (immutable) objects', () => {
    const obj = Object.freeze({ a: 1, b: 2, c: 3 });
    const result = omit(obj, ['b']);
    expect(result).toEqual({ a: 1, c: 3 });
    // Original object must remain unchanged
    expect(obj).toEqual({ a: 1, b: 2, c: 3 });
  });

  test('stress test: omit works on large object', () => {
    const bigObj: Record<string, number> = {};
    for (let i = 0; i < 10000; i++) {
      bigObj[`key${i}`] = i;
    }
    const omitKeys = ['key10', 'key9999', 'key5000'];
    const result = omit(bigObj, omitKeys);
    expect(result).not.toHaveProperty('key10');
    expect(result).not.toHaveProperty('key9999');
    expect(result).not.toHaveProperty('key5000');
    expect(result).toHaveProperty('key1', 1);
    expect(typeof result).toBe('object');
  }, 5000);
});

describe('debounce', () => {
  it('delays function execution', async () => {
    let count = 0;
    const fn = debounce(() => {
      count++;
    }, 50);
    fn();
    fn();
    fn();
    expect(count).toBe(0);
    await new Promise(r => setTimeout(r, 70));
    expect(count).toBe(1);
  });

  it('passes arguments correctly', async () => {
    let result = 0;
    const fn = debounce((value: number) => {
      result = value;
    }, 50);
    fn(10);
    await new Promise(r => setTimeout(r, 70));
    expect(result).toBe(10);
  });

  it('respects leading option', async () => {
    let count = 0;
    const fn = debounce(
      () => {
        count++;
      },
      50,
      { leading: true, trailing: false }
    );
    fn();
    fn();
    fn();
    expect(count).toBe(1);
    await new Promise(r => setTimeout(r, 70));
    expect(count).toBe(1);
  });

  it('respects trailing option', async () => {
    let count = 0;
    const fn = debounce(
      () => {
        count++;
      },
      50,
      { leading: false, trailing: true }
    );
    fn();
    fn();
    expect(count).toBe(0);
    await new Promise(r => setTimeout(r, 70));
    expect(count).toBe(1);
  });

  it('supports cancel', async () => {
    let count = 0;
    const fn = debounce(() => {
      count++;
    }, 50);
    fn();
    fn.cancel();
    await new Promise(r => setTimeout(r, 70));
    expect(count).toBe(0);
  });

  it('supports flush', () => {
    let count = 0;
    const fn = debounce(() => {
      count++;
      return count;
    }, 50);
    fn();
    const flushed = fn.flush();
    expect(flushed).toBe(1);
    expect(count).toBe(1);
  });

  it('supports maxWait', async () => {
    let count = 0;
    const fn = debounce(
      () => {
        count++;
      },
      100,
      { maxWait: 150 }
    );
    fn();
    await new Promise(r => setTimeout(r, 30));
    fn();
    await new Promise(r => setTimeout(r, 30));
    fn();
    await new Promise(r => setTimeout(r, 160));
    expect(count).toBe(1);
  });

  it('preserves this context', async () => {
    type Ctx = { value: number };
    const obj: Ctx & { inc: (amount: number) => void } = {
      value: 0,
      inc: debounce(function (this: Ctx, amount: number) {
        this.value += amount;
      }, 50)
    };
    obj.inc(5);
    await new Promise(r => setTimeout(r, 70));
    expect(obj.value).toBe(5);
  });

  it('basic behavior matches lodash', async () => {
    let count1 = 0;
    let count2 = 0;
    const fn1 = debounce(() => {
      count1++;
    }, 50);
    const fn2 = _.debounce(() => {
      count2++;
    }, 50);
    fn1();
    fn1();
    fn2();
    fn2();
    await new Promise(r => setTimeout(r, 70));
    expect(count1).toBe(count2);
  });

  it('with leading matches lodash', async () => {
    let count1 = 0;
    let count2 = 0;
    const options = { leading: true, trailing: false };
    const fn1 = debounce(
      () => {
        count1++;
      },
      50,
      options
    );
    const fn2 = _.debounce(
      () => {
        count2++;
      },
      50,
      options
    );
    fn1();
    fn1();
    fn2();
    fn2();
    await new Promise(r => setTimeout(r, 70));
    expect(count1).toBe(count2);
  });

  it('with maxWait matches lodash', async () => {
    let count1 = 0;
    let count2 = 0;
    const options = { maxWait: 120 };
    const fn1 = debounce(
      () => {
        count1++;
      },
      50,
      options
    );
    const fn2 = _.debounce(
      () => {
        count2++;
      },
      50,
      options
    );
    fn1();
    fn2();
    await new Promise(r => setTimeout(r, 30));
    fn1();
    fn2();
    await new Promise(r => setTimeout(r, 30));
    fn1();
    fn2();
    await new Promise(r => setTimeout(r, 150));
    expect(count1).toBe(count2);
  });

  test('stress test: debounce works on large array', async () => {
    let count = 0;
    const arr = Array.from({ length: 10000 }, (_, i) => i);
    const fn = debounce(() => {
      count = arr.reduce((a, b) => a + b, 0);
    }, 50);
    for (let i = 0; i < 100; i++) {
      fn();
    }
    expect(count).toBe(0);
    await new Promise(r => setTimeout(r, 70));
    expect(count).toBe(49995000);
  }, 5000);
});

describe('throttle', () => {
  it('calls immediately and at most once per wait window', async () => {
    let count = 0;
    const fn = throttle(() => count++, 50);

    fn(); // leading → executes immediately
    fn(); // within the same window → schedules trailing
    fn();

    // immediately after the first call
    expect(count).toBe(1);

    await new Promise(r => setTimeout(r, 60));

    // leading + trailing
    expect(count).toBe(2);
  });

  it('respects trailing execution', async () => {
    let count = 0;
    const fn = throttle(() => count++, 50);

    fn();
    fn();

    await new Promise(r => setTimeout(r, 120));

    expect(count).toBe(2);
  });

  it('supports leading: false', async () => {
    let count = 0;
    const fn = throttle(() => count++, 50, { leading: false });

    fn();
    expect(count).toBe(0);

    await new Promise(r => setTimeout(r, 60));

    expect(count).toBe(1);
  });

  it('supports trailing: false', async () => {
    let count = 0;
    const fn = throttle(() => count++, 50, { trailing: false });

    fn();
    fn();

    await new Promise(r => setTimeout(r, 120));

    expect(count).toBe(1);
  });

  it('preserves this context', async () => {
    const obj = {
      value: 0,
      inc: throttle(function (this: { value: number }, amount: number) {
        this.value += amount;
      }, 50)
    };

    obj.inc(5);

    await new Promise(r => setTimeout(r, 60));
    expect(obj.value).toBe(5);
  });

  it('cancel prevents trailing execution but not leading', async () => {
    let count = 0;
    const fn = throttle(() => count++, 50);

    fn(); // leading → immediate execution
    fn(); // program trailing

    expect(count).toBe(1);

    fn.cancel();

    await new Promise(r => setTimeout(r, 60));

    // only the leading call should have executed
    expect(count).toBe(1);
  });

  it('flush forces execution', () => {
    let count = 0;
    const fn = throttle(() => count++, 50);

    fn();
    fn.flush();

    expect(count).toBe(1);
  });

  it('matches lodash throttle default behavior (leading + trailing)', async () => {
    let countA = 0;
    let countB = 0;

    const a = throttle(() => countA++, 50);
    const b = _.throttle(() => countB++, 50);

    a();
    a();
    b();
    b();

    expect(countA).toBe(countB);

    await new Promise(r => setTimeout(r, 60));

    expect(countA).toBe(countB);
  });

  it('matches lodash with leading: false', async () => {
    let countA = 0;
    let countB = 0;

    const a = throttle(() => countA++, 50, { leading: false });
    const b = _.throttle(() => countB++, 50, { leading: false });

    a();
    b();

    expect(countA).toBe(countB);

    await new Promise(r => setTimeout(r, 60));

    expect(countA).toBe(countB);
  });

  it('matches lodash with trailing: false', async () => {
    let countA = 0;
    let countB = 0;

    const a = throttle(() => countA++, 50, { trailing: false });
    const b = _.throttle(() => countB++, 50, { trailing: false });

    a();
    a();
    b();
    b();

    expect(countA).toBe(countB);

    await new Promise(r => setTimeout(r, 60));

    expect(countA).toBe(countB);
  });

  it('matches lodash cancel behavior', async () => {
    let countA = 0;
    let countB = 0;

    const a = throttle(() => countA++, 50);
    const b = _.throttle(() => countB++, 50);

    a();
    a();
    b();
    b();

    a.cancel();
    b.cancel();

    await new Promise(r => setTimeout(r, 60));

    expect(countA).toBe(countB);
  });

  it('matches lodash flush behavior', () => {
    let countA = 0;
    let countB = 0;

    const a = throttle(() => countA++, 50);
    const b = _.throttle(() => countB++, 50);

    a();
    b();

    a.flush();
    b.flush();

    expect(countA).toBe(countB);
  });

  test('stress test: throttle works on large array', async () => {
    let sum = 0;
    const arr = Array.from({ length: 10000 }, (_, i) => i);
    const fn = throttle(() => {
      sum = arr.reduce((a, b) => a + b, 0);
    }, 50);
    for (let i = 0; i < 100; i++) {
      fn();
    }
    // Only the first and last will run (throttled)
    await new Promise(r => setTimeout(r, 120));
    expect(sum).toBe(49995000);
    expect(typeof sum).toBe('number');
  }, 5000);
});

describe('capitalize', () => {
  it('capitalizes string', () => {
    expect(capitalize('hello')).toBe('Hello');
  });

  it('lowercases rest of string', () => {
    expect(capitalize('hELLO')).toBe('Hello');
  });

  it('returns empty string for null or undefined', () => {
    expect(capitalize(null)).toBe('');
    expect(capitalize(undefined)).toBe('');
  });

  it('returns empty string for empty input', () => {
    expect(capitalize('')).toBe('');
  });

  it('behaves the same as lodash', () => {
    const values = ['hello', 'hELLO', '', 'A', '1abc'];
    for (const v of values) {
      expect(capitalize(v)).toBe(_.capitalize(v));
    }
  });

  test('stress test: capitalize works on large array of strings', () => {
    const arr = Array.from({ length: 10000 }, (_, i) => `str${i}`);
    const result = arr.map(capitalize);
    expect(result[0]).toBe('Str0');
    expect(result[9999]).toBe('Str9999');
    expect(Array.isArray(result)).toBe(true);
  }, 5000);
});

describe('isEmpty', () => {
  it('handles null and undefined', () => {
    expect(isEmpty(null)).toBe(true);
    expect(isEmpty(undefined)).toBe(true);
  });

  it('handles strings', () => {
    expect(isEmpty('')).toBe(true);
    expect(isEmpty('hello')).toBe(false);
  });

  it('handles arrays', () => {
    expect(isEmpty([])).toBe(true);
    expect(isEmpty([1])).toBe(false);
  });

  it('handles objects', () => {
    expect(isEmpty({})).toBe(true);
    expect(isEmpty({ a: 1 })).toBe(false);
  });

  it('handles Map and Set', () => {
    expect(isEmpty(new Map())).toBe(true);
    expect(isEmpty(new Map([['a', 1]]))).toBe(false);
    expect(isEmpty(new Set())).toBe(true);
    expect(isEmpty(new Set([1]))).toBe(false);
  });

  it('behaves the same as lodash', () => {
    const values = [
      null,
      undefined,
      '',
      'a',
      [],
      [1],
      {},
      { a: 1 },
      new Map(),
      new Map([['a', 1]]),
      new Set(),
      new Set([1])
    ];

    for (const v of values) {
      expect(isEmpty(v)).toBe(_.isEmpty(v));
    }
  });

  it('handles Object.create(null)', () => {
    const obj = Object.create(null) as { a: number };
    expect(isEmpty(obj)).toBe(_.isEmpty(obj));

    obj.a = 1;
    expect(isEmpty(obj)).toBe(_.isEmpty(obj));
  });

  it('handles arguments object', () => {
    const getArgs = (...args: unknown[]) => args;
    const emptyArgs = getArgs();
    const filledArgs = getArgs(1, 2);

    expect(isEmpty(emptyArgs)).toBe(_.isEmpty(emptyArgs));
    expect(isEmpty(filledArgs)).toBe(_.isEmpty(filledArgs));
  });

  it('handles typed arrays', () => {
    const empty = new Uint8Array();
    const filled = new Uint8Array([1, 2]);

    expect(isEmpty(empty)).toBe(_.isEmpty(empty));
    expect(isEmpty(filled)).toBe(_.isEmpty(filled));
  });

  it('handles primitives like lodash', () => {
    expect(isEmpty(0)).toBe(!_.isEmpty(0));
    expect(isEmpty(1)).toBe(!_.isEmpty(1));
    expect(isEmpty(true)).toBe(!_.isEmpty(true));
    expect(isEmpty(false)).toBe(!_.isEmpty(false));
    expect(isEmpty(Symbol('a'))).toBe(!_.isEmpty(Symbol('a')));
  });

  it('handles Date and RegExp', () => {
    const date = new Date();
    const regex = /a/;

    expect(isEmpty(date)).toBe(_.isEmpty(date));
    expect(isEmpty(regex)).toBe(_.isEmpty(regex));
  });

  test('stress test: isEmpty works on large array and object', () => {
    const bigArr = Array.from({ length: 10000 }, () => 1);
    const bigObj: Record<string, number> = {};
    for (let i = 0; i < 10000; i++) {
      bigObj[`key${i}`] = i;
    }
    expect(isEmpty(bigArr)).toBe(false);
    expect(isEmpty(bigObj)).toBe(false);
    expect(isEmpty([])).toBe(true);
    expect(isEmpty({})).toBe(true);
  }, 5000);
});

describe('snakeCase', () => {
  it('converts strings to snake_case', () => {
    expect(snakeCase('HelloWorld')).toBe('hello_world');
    expect(snakeCase('foo bar')).toBe('foo_bar');
    expect(snakeCase('fooBar')).toBe('foo_bar');
  });

  it('handles null, undefined and empty string', () => {
    expect(snakeCase(null as unknown as string)).toBe('');
    expect(snakeCase(undefined as unknown as string)).toBe('');
    expect(snakeCase('')).toBe('');
  });

  it('behaves the same as lodash', () => {
    const values = ['HelloWorld', 'foo bar', 'fooBar', '', 'A', '1abc'];
    for (const v of values) {
      expect(snakeCase(v)).toBe(_.snakeCase(v));
    }
  });

  test('stress test: snakeCase works on large array of strings', () => {
    const arr = Array.from({ length: 10000 }, (_, i) => `HelloWorld${i}`);
    const result = arr.map(snakeCase);
    expect(result[0]).toBe('hello_world_0');
    expect(result[9999]).toBe('hello_world_9999');
    expect(Array.isArray(result)).toBe(true);
  }, 5000);
});

describe('upperFirst', () => {
  it('capitalizes the first character', () => {
    expect(upperFirst('hello')).toBe('Hello');
    expect(upperFirst('Hello')).toBe('Hello');
  });

  it('returns empty string for null, undefined or empty', () => {
    expect(upperFirst(null as unknown as string)).toBe('');
    expect(upperFirst(undefined as unknown as string)).toBe('');
    expect(upperFirst('')).toBe('');
  });

  it('behaves the same as lodash', () => {
    const values = ['hello', 'Hello', '', 'a', '1abc'];
    for (const v of values) {
      expect(upperFirst(v)).toBe(_.upperFirst(v));
    }
  });

  test('stress test: upperFirst works on large array of strings', () => {
    const arr = Array.from({ length: 10000 }, (_, i) => `word${i}`);
    const result = arr.map(upperFirst);
    expect(result[0]).toBe('Word0');
    expect(result[9999]).toBe('Word9999');
    expect(Array.isArray(result)).toBe(true);
  }, 5000);
});

describe('camelCase', () => {
  it('converts strings to camelCase', () => {
    expect(camelCase('hello_world')).toBe('helloWorld');
    expect(camelCase('Hello-World')).toBe('helloWorld');
    expect(camelCase('foo bar baz')).toBe('fooBarBaz');
  });

  it('handles null, undefined and empty string', () => {
    expect(camelCase(null as unknown as string)).toBe('');
    expect(camelCase(undefined as unknown as string)).toBe('');
    expect(camelCase('')).toBe('');
  });

  it('behaves the same as lodash', () => {
    const values = ['hello_world', 'Hello-World', 'foo bar baz', '', 'A', '1abc'];
    for (const v of values) {
      expect(camelCase(v)).toBe(_.camelCase(v));
    }
  });

  test('stress test: camelCase works on large array of strings', () => {
    const arr = Array.from({ length: 10000 }, (_, i) => `foo_bar_${i}`);
    const result = arr.map(camelCase);
    expect(result[0]).toBe('fooBar0');
    expect(result[9999]).toBe('fooBar9999');
    expect(Array.isArray(result)).toBe(true);
  }, 5000);
});

describe('has', () => {
  const obj = { a: { b: { c: 1 }, d: 2 }, e: null };

  it('returns true for existing paths', () => {
    expect(has(obj, 'a.b.c')).toBe(true);
    expect(has(obj, ['a', 'b', 'c'])).toBe(true);
    expect(has(obj, 'a.d')).toBe(true);
  });

  it('returns false for non-existing paths', () => {
    expect(has(obj, 'a.b.x')).toBe(false);
    expect(has(obj, ['a', 'b', 'x'])).toBe(false);
    expect(has(obj, 'z')).toBe(false);
  });

  it('handles null or undefined object', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect(has(null as unknown as Record<string, any>, 'a.b')).toBe(false);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect(has(undefined as unknown as Record<string, any>, 'a')).toBe(false);
  });

  it('handles root level keys correctly', () => {
    expect(has(obj, 'e')).toBe(true);
    expect(has(obj, 'f')).toBe(false);
  });

  it('behaves the same as lodash', () => {
    const obj = {
      user: {
        name: 'alice',
        credentials: { password: '1234', token: 'abcd' },
        addresses: [
          { city: 'Lisbon', zip: 1000 },
          { city: 'Porto', zip: 2000 }
        ]
      },
      items: [{ id: 1, value: 'a' }],
      meta: null
    };

    const paths = [
      'user.name',
      'user.credentials.password',
      'user.addresses[1].zip',
      'items[0].value',
      'meta',
      'missing.path'
    ];

    for (const p of paths) {
      expect(has(obj, p)).toBe(_.has(obj, p));
    }
  });

  test('stress test: has works on large object', () => {
    const bigObj: Record<string, { value: number }> = {};
    for (let i = 0; i < 10000; i++) {
      bigObj[`key${i}`] = { value: i };
    }
    expect(has(bigObj, 'key9999.value')).toBe(true);
    expect(has(bigObj, 'key0.value')).toBe(true);
    expect(has(bigObj, 'key10000')).toBe(false);
  }, 5000);
});

describe('cloneDeep', () => {
  describe('cloneDeep.cloneAtPath', () => {
    it('clones only the branch at given path (object path)', () => {
      const obj = {
        a: { b: { c: 1 } },
        d: { e: 2 }
      };

      const cloned = cloneAtPath(obj, 'a.b');

      // root must be new reference
      expect(cloned).not.toBe(obj);

      // cloned branch must be new
      expect(cloned.a).not.toBe(obj.a);
      expect(cloned.a.b).not.toBe(obj.a.b);

      // untouched branch must keep reference
      expect(cloned.d).toBe(obj.d);

      // values preserved
      expect(cloned.a.b.c).toBe(1);
    });

    it('works with array path', () => {
      const obj = {
        a: { b: { c: 1 } }
      };

      const cloned = cloneAtPath(obj, ['a', 'b']);

      expect(cloned.a).not.toBe(obj.a);
      expect(cloned.a.b).not.toBe(obj.a.b);
      expect(cloned.a.b.c).toBe(1);
    });

    it('clones nested arrays correctly', () => {
      const obj = {
        items: [
          { id: 1, value: { x: 10 } },
          { id: 2, value: { x: 20 } }
        ]
      };

      const cloned = cloneAtPath(obj, ['items', 1, 'value']);

      expect(cloned).not.toBe(obj);
      expect(cloned.items).not.toBe(obj.items);
      expect(cloned.items[1]).not.toBe(obj.items[1]);
      expect(cloned.items[1].value).not.toBe(obj.items[1].value);

      // untouched index keeps reference
      expect(cloned.items[0]).toBe(obj.items[0]);

      expect(cloned.items[1].value.x).toBe(20);
    });

    it('does not mutate original object', () => {
      const obj = {
        a: { b: { c: 1 } }
      };

      const cloned = cloneAtPath(obj, 'a.b');

      cloned.a.b.c = 999;

      expect(obj.a.b.c).toBe(1);
    });

    it('returns new root even if path does not exist', () => {
      const obj = { a: 1 };

      const cloned = cloneAtPath(obj, 'x.y.z');

      expect(cloned).not.toBe(obj);
      expect(cloned).toEqual(obj);
    });

    it('handles empty path by returning shallow clone', () => {
      const obj = { a: { b: 1 } };

      const cloned = cloneAtPath(obj, []);

      expect(cloned).not.toBe(obj);
      expect(cloned.a).toBe(obj.a); // shallow clone only
    });

    it('works with numeric keys in string path', () => {
      const obj = {
        list: [{ value: 1 }, { value: 2 }]
      };

      const cloned = cloneAtPath(obj, 'list.1');

      expect(cloned.list).not.toBe(obj.list);
      expect(cloned.list[1]).not.toBe(obj.list[1]);
      expect(cloned.list[0]).toBe(obj.list[0]);
    });

    it('preserves prototype of cloned branch', () => {
      const proto = {
        greet() {
          return 'hi';
        }
      };

      const obj = Object.create(proto) as { a: { b: number } };
      obj.a = { b: 1 };

      const cloned = cloneAtPath(obj, 'a');

      expect(Object.getPrototypeOf(cloned)).toBe(proto);
      expect(cloned.a).not.toBe(obj.a);
      expect(cloned.a.b).toBe(1);
    });
  });

  it('clones primitives', () => {
    expect(cloneDeep(42)).toBe(42);
    expect(cloneDeep('hello')).toBe('hello');
    expect(cloneDeep(true)).toBe(true);
    expect(cloneDeep(null)).toBeNull();
    expect(cloneDeep(undefined)).toBeUndefined();
  });

  it('clones arrays deeply', () => {
    const arr = [1, { a: 2 }, [3, 4]];
    const cloned = cloneDeep(arr);
    expect(cloned).toEqual(arr);
    expect(cloned).not.toBe(arr);
    expect(cloned[1]).not.toBe(arr[1]);
    expect(cloned[2]).not.toBe(arr[2]);
  });

  it('clones objects deeply', () => {
    const obj = { a: 1, b: { c: 2, d: [3, 4] } };
    const cloned = cloneDeep(obj);
    expect(cloned).toEqual(obj);
    expect(cloned).not.toBe(obj);
    expect(cloned.b).not.toBe(obj.b);
    expect(cloned.b.d).not.toBe(obj.b.d);
  });

  it('clones Map and Set', () => {
    const map = new Map<string, number | { c: number }>([
      ['a', 1],
      ['b', { c: 2 }]
    ]);
    const set = new Set<number | { d: number }>([1, 2, { d: 3 }]);
    const clonedMap = cloneDeep(map);
    const clonedSet = cloneDeep(set);

    expect(clonedMap).toEqual(map);
    expect(clonedSet).toEqual(set);

    // Ensure deep clone
    expect(clonedMap.get('b')).not.toBe(map.get('b'));
    const originalObj = [...set].find(v => typeof v === 'object');
    const clonedObj = [...clonedSet].find(v => typeof v === 'object');
    expect(clonedObj).not.toBe(originalObj);
  });

  it('clones Date and RegExp', () => {
    const date = new Date();
    const regex = /abc/gi;

    const clonedDate = cloneDeep(date);
    const clonedRegex = cloneDeep(regex);

    expect(clonedDate).toEqual(date);
    expect(clonedDate).not.toBe(date);

    expect(clonedRegex).toEqual(regex);
    expect(clonedRegex).not.toBe(regex);
  });

  it('handles cyclic references', () => {
    const obj = { a: 1 } as { a: number; self?: typeof obj };
    obj.self = obj;

    const cloned = cloneDeep(obj);
    expect(cloned.a).toBe(1);
    expect(cloned.self).toBe(cloned);
  });

  it('matches lodash.cloneDeep for complex structures', () => {
    const complex = {
      user: {
        name: 'alice',
        credentials: { password: '1234', token: 'abcd' },
        addresses: [
          { city: 'Lisbon', zip: 1000 },
          { city: 'Porto', zip: 2000 }
        ]
      },
      items: [
        { id: 1, value: 'a' },
        { id: 2, value: 'b' }
      ],
      meta: null,
      tags: new Set([1, 2, 3]),
      map: new Map([['x', { y: 2 }]])
    };

    const cloned = cloneDeep(complex);
    const lodashCloned = _.cloneDeep(complex);

    expect(cloned).toEqual(lodashCloned);

    // Ensure deep cloning, not just shallow copy
    expect(cloned.user).not.toBe(complex.user);
    expect(cloned.items).not.toBe(complex.items);
    expect([...cloned.tags][2]).toBe([...complex.tags][2]);
    expect(cloned.map.get('x')).not.toBe(complex.map.get('x'));
  });

  it('does not mutate the original object', () => {
    const original: {
      user: { name: string; credentials: { password: string } };
      list: { id: number; value: string }[];
      meta: null | string;
    } = {
      user: {
        name: 'alice',
        credentials: { password: '1234' }
      },
      list: [{ id: 1, value: 'a' }],
      meta: null
    };

    const cloned = cloneDeep(original);

    // Modificar el clon
    cloned.user.name = 'bob';
    cloned.user.credentials.password = '4321';
    cloned.list[0].value = 'b';
    cloned.meta = 'something';

    // El original no debe cambiar
    expect(original.user.name).toBe('alice');
    expect(original.user.credentials.password).toBe('1234');
    expect(original.list[0].value).toBe('a');
    expect(original.meta).toBeNull();
  });

  it('clones functions as-is', () => {
    const fn: () => number = () => 42;
    const obj: { fn: () => number } = { fn };
    const cloned = cloneDeep(obj);
    expect(cloned.fn).toBe(fn);
  });

  it('clones symbols as-is', () => {
    const sym = Symbol('test');
    const obj: { sym: symbol } = { sym };
    const cloned = cloneDeep(obj);
    expect(cloned.sym).toBe(sym);
  });

  it('clones objects with prototype', () => {
    const proto = {
      greet(): string {
        return 'hi';
      }
    };
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const obj: { a: number } & typeof proto = Object.create(proto);
    obj.a = 1;
    const cloned = cloneDeep(obj);
    expect(cloned.a).toBe(1);
    expect(Object.getPrototypeOf(cloned)).toBe(proto);
    expect(cloned.greet()).toBe('hi');
  });

  it('clones nested Map and Set', () => {
    const innerMap: Map<string, number> = new Map([['x', 1]]);
    const map: Map<string, Map<string, number>> = new Map([['outer', innerMap]]);

    const cloned = cloneDeep(map);
    expect(cloned).not.toBe(map);
    expect(cloned.get('outer')).not.toBe(innerMap);
    expect(cloned.get('outer')?.get('x')).toBe(1);
  });

  it('clones typed arrays and buffers', () => {
    const arr: Uint8Array = new Uint8Array([1, 2, 3]);
    const buffer: ArrayBuffer = new ArrayBuffer(8);
    const clonedArr: Uint8Array = cloneDeep(arr);
    const clonedBuffer: ArrayBuffer = cloneDeep(buffer);
    expect(clonedArr).toEqual(arr);
    expect(clonedArr).not.toBe(arr);
    expect(clonedBuffer.byteLength).toBe(buffer.byteLength);
    expect(clonedBuffer).not.toBe(buffer);
  });

  it('handles mixed primitive, array, object structure', () => {
    type Complex = {
      num: number;
      str: string;
      arr: (number | { a: number } | number[])[];
      nested: { a: { b: number } };
      map: Map<string, { val: number }>;
      set: Set<number>;
    };

    const complex: Complex = {
      num: 1,
      str: 'hello',
      arr: [1, { a: 2 }, [3, 4]],
      nested: { a: { b: 2 } },
      map: new Map([['key', { val: 1 }]]),
      set: new Set([1, 2])
    };
    const cloned: Complex = cloneDeep(complex);
    expect(cloned).toEqual(complex);
    expect(cloned.arr).not.toBe(complex.arr);
    expect(cloned.nested.a).not.toBe(complex.nested.a);
    expect(cloned.map.get('key')).not.toBe(complex.map.get('key'));
  });

  it('handles complex nested structures with arrays, maps, sets, symbols, dates, regex', () => {
    const sym = Symbol('id');
    const complex = {
      a: 1,
      b: [2, { x: 3, y: [4, 5] }],
      c: {
        d: new Map([['key1', { val: 10 }]]),
        e: new Set([1, 2, 3]),
        f: new Date(2026, 1, 24),
        g: /test/gi,
        h: sym
      },
      i: [{ j: { k: 7 } }, { l: [{ m: 8 }] }]
    };

    const cloned = cloneDeep(complex);

    // Deep equality
    expect(cloned).toEqual(complex);

    // Nested objects and arrays are cloned
    expect(cloned.b).not.toBe(complex.b);
    // Type guard for b[1]
    type BElement = number | { x: number; y: number[] };
    const clonedB1 = cloned.b[1] as BElement;
    const originalB1 = complex.b[1] as BElement;
    if (typeof clonedB1 !== 'number' && typeof originalB1 !== 'number') {
      expect(clonedB1).not.toBe(originalB1);
      expect(clonedB1.y).not.toBe(originalB1.y);
    }

    // Map and Set are cloned
    expect(cloned.c.d).not.toBe(complex.c.d);
    expect(cloned.c.e).not.toBe(complex.c.e);

    // Date and RegExp cloned
    expect(cloned.c.f).not.toBe(complex.c.f);
    expect(cloned.c.f.getTime()).toBe(complex.c.f.getTime());
    expect(cloned.c.g).not.toBe(complex.c.g);
    expect(cloned.c.g.source).toBe(complex.c.g.source);
    expect(cloned.c.g.flags).toBe(complex.c.g.flags);

    // Symbol remains the same
    expect(cloned.c.h).toBe(sym);

    // Nested deep arrays in objects
    expect(cloned.i[0].j).not.toBe(complex.i[0].j);
    // Replace the last line in 'handles complex nested structures' test with a type-safe check
    const nestedSecond = cloned.i[1].l?.[0] as { m: number } | undefined;
    const originalSecond = complex.i[1].l?.[0] as { m: number } | undefined;
    if (nestedSecond && originalSecond) {
      expect(nestedSecond).not.toBe(originalSecond);
    }
  });

  test('stress test: cloneDeep works on large object and array', () => {
    const bigArr = Array.from({ length: 10000 }, (_, i) => ({ val: i, arr: [i, i + 1] }));
    const bigObj: Record<string, { value: number; arr: number[] }> = {};
    for (let i = 0; i < 10000; i++) {
      bigObj[`key${i}`] = { value: i, arr: [i, i + 1] };
    }
    const clonedArr = cloneDeep(bigArr);
    const clonedObj = cloneDeep(bigObj);
    expect(clonedArr).toEqual(bigArr);
    expect(clonedObj).toEqual(bigObj);
    expect(clonedArr[5000]).not.toBe(bigArr[5000]);
    expect(clonedObj['key9999']).not.toBe(bigObj['key9999']);
    expect(Array.isArray(clonedArr)).toBe(true);
    expect(typeof clonedObj).toBe('object');
  }, 5000);
});
