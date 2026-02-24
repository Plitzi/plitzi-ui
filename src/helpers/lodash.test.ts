/* eslint-disable @typescript-eslint/no-confusing-void-expression */
import _ from 'lodash';
import { describe, it, expect } from 'vitest';

import { get, set, pick, omit, debounce } from './lodash';

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
});
