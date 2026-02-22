import _ from 'lodash';
import { describe, it, expect } from 'vitest';

import { get, set, pick, omit } from './lodash';

describe('get', () => {
  const obj = {
    a: {
      b: { c: 1 },
      list: [{ name: 'john', age: 30 }]
    }
  };

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
});

describe('set', () => {
  it('sets deep value', () => {
    const obj: Record<string, unknown> = {};
    set(obj, 'a.b.c', 5);

    expect(get(obj, 'a.b.c')).toBe(5);
  });
});

describe('pick / omit', () => {
  const obj = { a: 1, b: 2, c: 3 };

  it('pick works', () => {
    const result = pick(obj, ['a', 'c']);
    expect(result).toEqual({ a: 1, c: 3 });
  });

  it('omit works with array of keys', () => {
    const result = omit(obj, ['b']);
    expect(result).toEqual({ a: 1, c: 3 });
  });

  it('omit works with single string path', () => {
    const result = omit(obj, 'b');
    expect(result).toEqual({ a: 1, c: 3 });
  });

  it('optional values are handled correctly', () => {
    const objWithUndefined = { a: 1, b: undefined, c: 3 } as { a: number; b?: number; c: number };
    const picked = pick(objWithUndefined, ['a', 'b']);
    expect(picked).toEqual({ a: 1 });
    const omitted = omit(objWithUndefined, ['b']);
    expect(omitted).toEqual({ a: 1, c: 3 });

    const objWithMissingValues = { a: 1, c: 3 } as { a: number; b?: number; c: number };
    const pickedMissing = pick(objWithMissingValues, ['a', 'b']);
    expect(pickedMissing).toEqual({ a: 1 });
    const omittedMissing = omit(objWithMissingValues, ['b']);
    expect(omittedMissing).toEqual({ a: 1, c: 3 });
  });
});

describe('pick (deep cases)', () => {
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

  it('picks deep nested value', () => {
    const result = pick(obj, ['user.address.city']);
    expect(result).toEqual({
      user: {
        address: {
          city: 'Lisbon'
        }
      }
    });
  });

  it('picks multiple deep paths', () => {
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

  it('supports array index paths', () => {
    const result = pick(obj, ['list[0].value']);

    expect(result).toEqual({
      list: [{ value: 'a' }]
    });
  });

  it('ignores non-existing paths', () => {
    const result = pick(obj, ['user.age']);
    expect(result).toEqual({});
  });

  it('does not mutate original object', () => {
    const result = pick(obj, ['user.name']);
    expect(obj.user.name).toBe('john');
    expect(result).not.toBe(obj);
  });
});

describe('omit (deep cases)', () => {
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

  it('omits deep nested value', () => {
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

  it('omits multiple deep paths', () => {
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

  it('ignores non-existing paths', () => {
    const result = omit(obj, ['user.age']);
    expect(result).toEqual(obj);
  });

  it('does not mutate original object', () => {
    const result = omit(obj, ['user.password']);
    expect(obj.user.password).toBe('secret');
    expect(result).not.toBe(obj);
  });
});

describe('edge cases', () => {
  it('get returns undefined for null object', () => {
    expect(get(null, 'a.b')).toBeUndefined();
  });

  it('set with empty path does nothing', () => {
    const obj: Record<string, unknown> = { a: 1 };
    set(obj, '', 5);
    expect(obj).toEqual({ a: 1 });
  });

  it('pick with empty paths returns empty object', () => {
    const obj = { a: 1 };
    expect(pick(obj, [])).toEqual({});
  });

  it('omit with empty paths returns clone', () => {
    const obj = { a: 1 };
    const result = omit(obj, []);
    expect(result).toEqual(obj);
    expect(result).not.toBe(obj);
  });

  it('set overwrites primitive with object when needed', () => {
    const obj: Record<string, unknown> = { a: 1 };
    set(obj, 'a.b.c', 10);
    expect(get(obj, 'a.b.c')).toBe(10);
  });
});

describe('get additional cases', () => {
  it('supports path as array', () => {
    const obj = { a: { b: { c: 42 } } };
    expect(get(obj, ['a', 'b', 'c'])).toBe(42);
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
});

describe('set additional cases', () => {
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
});

describe('pick additional cases', () => {
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
});

describe('omit additional cases with single path', () => {
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
});

describe('comparison with lodash', () => {
  it('get behaves the same as lodash', () => {
    const obj = { a: { b: { c: 42 }, list: [{ x: 1 }] } };

    expect(get(obj, 'a.b.c')).toEqual(_.get(obj, 'a.b.c'));
    expect(get(obj, ['a', 'b', 'c'])).toEqual(_.get(obj, ['a', 'b', 'c']));
    expect(get(obj, 'a.list[0].x')).toEqual(_.get(obj, 'a.list[0].x'));
    expect(get(obj, 'a.missing', 'default')).toEqual(_.get(obj, 'a.missing', 'default'));
  });

  it('set behaves the same as lodash', () => {
    const obj1: Record<string, unknown> = {};
    const obj2: Record<string, unknown> = {};

    set(obj1, 'a.b.c', 10);
    _.set(obj2, 'a.b.c', 10);
    expect(obj1).toEqual(obj2);

    set(obj1, 'list[0].x', 5);
    _.set(obj2, 'list[0].x', 5);
    expect(obj1).toEqual(obj2);
  });

  it('pick behaves the same as lodash', () => {
    const obj = { a: 1, b: { c: 2, d: 3 } };

    const result1 = pick(obj, ['a', 'b.c']);
    const result2 = _.pick(obj, ['a', 'b.c']);

    expect(result1).toEqual(result2);
  });

  it('omit behaves the same as lodash', () => {
    const obj = { a: 1, b: { c: 2, d: 3 } };

    const result1 = omit(obj, ['a', 'b.c']);
    const result2 = _.omit(obj, ['a', 'b.c']);

    expect(result1).toEqual(result2);
  });
});

describe('extended comparison with lodash', () => {
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

  it('get with deep paths matches lodash', () => {
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

  it('set with deep paths matches lodash', () => {
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

  it('pick with nested paths matches lodash', () => {
    const paths = ['user.name', 'user.credentials.password', 'user.addresses[0].city', 'items[1].value'];

    const result1 = pick(obj, paths);
    const result2 = _.pick(obj, paths);

    expect(result1).toEqual(result2);
  });

  it('omit with nested paths matches lodash', () => {
    const paths = ['user.credentials.token', 'user.addresses[1]', 'items[0].value'];

    const result1 = omit(obj, paths);
    const result2 = _.omit(obj, paths);

    expect(result1).toEqual(result2);
  });

  it('handles array paths as arrays', () => {
    const arrayPaths = [
      ['user', 'credentials', 'password'],
      ['items', '1', 'value']
    ];
    const result1 = pick(obj, arrayPaths);
    const result2 = _.pick(obj, arrayPaths); // Lodash accepts array of strings
    expect(result1).toEqual(result2);
  });
});
