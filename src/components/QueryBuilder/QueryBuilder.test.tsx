/* eslint-disable quotes */
// Packages
import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

// Relatives
import QueryBuilderEvaluator, {
  evaluateBeginsWith,
  evaluateBetween,
  evaluateContains,
  evaluateEmpty,
  evaluateEndsWith,
  evaluateEquals,
  evaluateGreaterThan,
  evaluateGreaterThanOrEqual,
  evaluateIn,
  evaluateLessThan,
  evaluateLessThanOrEqual,
  getValuesRequired,
  transformQuery
} from './helpers/QueryBuilderEvaluator';
import QueryBuilderFormatter from './helpers/QueryBuilderFormatter';
import QueryBuilder from './QueryBuilder';

// Types
import type { RuleGroup } from './QueryBuilder';

describe('QueryBuilder', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<QueryBuilder />);

    expect(baseElement).toBeTruthy();
  });

  it('should render custom props successfully', () => {
    // let component = render(
    //   <Heading type="h1" className="customClass">
    //     Hello World
    //   </Heading>
    // );
    // expect(component.container.firstChild).toBeTruthy();
    // expect(component.container.getElementsByClassName('customClass').length).toBe(1);
    // expect(component.getByText(/Hello World/i)).toBeTruthy();
    // expect(component.container.getElementsByTagName('h1').length).toBe(1);
  });

  it('should transform', () => {
    const queryRaw: RuleGroup = {
      id: '6533cb2b-f78c-4558-b9ae-ca4a16946680',
      combinator: 'and',
      rules: [
        {
          id: '1d6e3fe0-ea9c-4761-8a00-7c4f3b03fb7b',
          field: 'firstName',
          value: 'Stev',
          operator: 'beginsWith'
        },
        {
          id: '6c54e5ee-c982-4373-833d-1ae4887d5c10',
          field: 'lastName',
          value: 'Vai, Vaughan',
          operator: 'in'
        },
        {
          id: '0c9054ab-b8bd-4880-91b3-c9d4a70d2977',
          field: 'age',
          operator: '>',
          value: '28'
        },
        {
          id: '8949338f-2d87-408c-947d-f7eab73b505e',
          combinator: 'or',
          rules: [
            {
              id: '21b87854-8a51-4957-8b7d-87e2e2f35a88',
              field: 'isMusician',
              operator: '=',
              value: true
            },
            {
              id: '4a9352d7-9756-4096-b655-64fafb551cb0',
              field: 'instrument',
              operator: '=',
              value: 'Guitar'
            }
          ]
        },
        {
          id: 'fbd73b31-d57f-4e1c-8175-e2fe5f12fae7',
          field: 'birthdate',
          operator: 'between',
          value: '1954-10-03,1960-06-06'
        }
      ]
    };

    const query = transformQuery(queryRaw);

    expect(query).toEqual({
      combinator: 'and',
      rules: [
        {
          field: 'firstName',
          value: 'Stev',
          operator: 'beginsWith'
        },
        {
          field: 'lastName',
          value: 'Vai, Vaughan',
          operator: 'in'
        },
        {
          field: 'age',
          operator: '>',
          value: '28'
        },
        {
          combinator: 'or',
          rules: [
            {
              field: 'isMusician',
              operator: '=',
              value: true
            },
            {
              field: 'instrument',
              operator: '=',
              value: 'Guitar'
            }
          ]
        },
        {
          field: 'birthdate',
          operator: 'between',
          value: '1954-10-03,1960-06-06'
        }
      ]
    });
  });

  it('should evaluate equals', () => {
    expect(evaluateEquals('a', 'a')).toEqual(true);
    expect(evaluateEquals('a', 1)).toEqual(false);
    expect(evaluateEquals('hello world', 'Hello World')).toEqual(false);
    expect(evaluateEquals(5, 5)).toEqual(true);
    expect(evaluateEquals('05', 5)).toEqual(false);
    expect(evaluateEquals('05', '005')).toEqual(false);
    expect(evaluateEquals('5', 5)).toEqual(true);
    expect(evaluateEquals(0.5, 0.5)).toEqual(true);
    expect(evaluateEquals(0.5, 0.25)).toEqual(false);
    expect(evaluateEquals(true, true)).toEqual(true);
    expect(evaluateEquals(false, true)).toEqual(false);
    expect(evaluateEquals('', null)).toEqual(false);
    expect(evaluateEquals(undefined, null)).toEqual(false);
    expect(evaluateEquals(undefined, undefined)).toEqual(true);
    expect(evaluateEquals(true, 'true')).toEqual(true);
    expect(evaluateEquals(false, 'false')).toEqual(true);
    expect(evaluateEquals(true, 'false')).toEqual(false);
    expect(evaluateEquals(false, 'true')).toEqual(false);
    expect(evaluateEquals(true, '1')).toEqual(true);
    expect(evaluateEquals(false, '0')).toEqual(true);
    expect(evaluateEquals(true, '0')).toEqual(false);
    expect(evaluateEquals(false, '1')).toEqual(false);
    expect(evaluateEquals('true', true)).toEqual(true);
    expect(evaluateEquals('false', false)).toEqual(true);
    expect(evaluateEquals('false', true)).toEqual(false);
    expect(evaluateEquals('true', false)).toEqual(false);
    expect(evaluateEquals('1', true)).toEqual(true);
    expect(evaluateEquals('0', false)).toEqual(true);
    expect(evaluateEquals('0', true)).toEqual(false);
    expect(evaluateEquals('1', false)).toEqual(false);
  });

  it('should evaluate greater than', () => {
    expect(evaluateGreaterThan(3, 5)).toEqual(true);
    expect(evaluateGreaterThan(5, 5)).toEqual(false);
    expect(evaluateGreaterThan('a', 'a')).toEqual(false);
    expect(evaluateGreaterThan(2.99, 3)).toEqual(true);
    expect(evaluateGreaterThan(3.1, 4.5)).toEqual(true);
    expect(evaluateGreaterThan('a', 'b')).toEqual(true);
    expect(evaluateGreaterThan('2022-01-01', '2023-01-01')).toEqual(true);
    expect(evaluateGreaterThan('05', '005')).toEqual(false);
  });

  it('should evaluate greater than or equal', () => {
    expect(evaluateGreaterThanOrEqual(3, 5)).toEqual(true);
    expect(evaluateGreaterThanOrEqual(5, 5)).toEqual(true);
    expect(evaluateGreaterThanOrEqual('a', 'a')).toEqual(true);
    expect(evaluateGreaterThanOrEqual(2.99, 3)).toEqual(true);
    expect(evaluateGreaterThanOrEqual(3.1, 4.5)).toEqual(true);
    expect(evaluateGreaterThanOrEqual('a', 'b')).toEqual(true);
    expect(evaluateGreaterThanOrEqual('2022-01-01', '2023-01-01')).toEqual(true);
    expect(evaluateGreaterThanOrEqual('05', '005')).toEqual(false);
  });

  it('should evaluate less than', () => {
    expect(evaluateLessThan(5, 3)).toEqual(true);
    expect(evaluateLessThan(5, 5)).toEqual(false);
    expect(evaluateLessThan('a', 'a')).toEqual(false);
    expect(evaluateLessThan(3, 2.99)).toEqual(true);
    expect(evaluateLessThan(4.5, 3.1)).toEqual(true);
    expect(evaluateLessThan('b', 'a')).toEqual(true);
    expect(evaluateLessThan('2023-01-01', '2022-01-01')).toEqual(true);
    expect(evaluateLessThan('005', '05')).toEqual(false);
  });

  it('should evaluate less than or equal', () => {
    expect(evaluateLessThanOrEqual(5, 3)).toEqual(true);
    expect(evaluateLessThanOrEqual(5, 5)).toEqual(true);
    expect(evaluateLessThanOrEqual('a', 'a')).toEqual(true);
    expect(evaluateLessThanOrEqual(3, 2.99)).toEqual(true);
    expect(evaluateLessThanOrEqual(4.5, 3.1)).toEqual(true);
    expect(evaluateLessThanOrEqual('b', 'a')).toEqual(true);
    expect(evaluateLessThanOrEqual('2023-01-01', '2022-01-01')).toEqual(true);
    expect(evaluateLessThanOrEqual('005', '05')).toEqual(false);
  });

  it('should evaluate begins with', () => {
    expect(evaluateBeginsWith('hel', 'hello world')).toEqual(true);
    expect(evaluateBeginsWith('hel', 'Hello world')).toEqual(true);
    expect(evaluateBeginsWith('hel', 'hillo world')).toEqual(false);
    expect(evaluateBeginsWith('test', 123)).toEqual(false);
    expect(evaluateBeginsWith('test', true)).toEqual(false);
    expect(evaluateBeginsWith('test', undefined)).toEqual(false);
    expect(evaluateBeginsWith('test', true)).toEqual(false);
  });

  it('should evaluate ends with', () => {
    expect(evaluateEndsWith('rld', 'hello world')).toEqual(true);
    expect(evaluateEndsWith('rld', 'hello woRlD')).toEqual(true);
    expect(evaluateEndsWith('rld', 'hello people')).toEqual(false);
    expect(evaluateEndsWith('test', 123)).toEqual(false);
    expect(evaluateEndsWith('test', true)).toEqual(false);
    expect(evaluateEndsWith('test', undefined)).toEqual(false);
    expect(evaluateEndsWith('test', true)).toEqual(false);
  });

  it('should evaluate contains', () => {
    expect(evaluateContains('hel', 'hello world')).toEqual(true);
    expect(evaluateContains('hel', 'Hello world')).toEqual(true);
    expect(evaluateContains('hel', 'hillo world')).toEqual(false);
    expect(evaluateContains('test', 123)).toEqual(false);
    expect(evaluateContains('test', true)).toEqual(false);
    expect(evaluateContains('test', undefined)).toEqual(false);
    expect(evaluateContains('test', true)).toEqual(false);
  });

  it('should evaluate empty', () => {
    expect(evaluateEmpty(true)).toEqual(false);
    expect(evaluateEmpty(false)).toEqual(false);
    expect(evaluateEmpty(0)).toEqual(false);
    expect(evaluateEmpty('')).toEqual(true);
    expect(evaluateEmpty({})).toEqual(true);
    expect(evaluateEmpty([])).toEqual(true);
    expect(evaluateEmpty(undefined)).toEqual(true);
    expect(evaluateEmpty(null)).toEqual(true);
  });

  it('should evaluate in', () => {
    expect(evaluateIn('1,2,3', '1')).toEqual(true);
    expect(evaluateIn('1,2,3', 1)).toEqual(true);
    expect(evaluateIn('1,2,3', '1,2')).toEqual(true);
    expect(evaluateIn('1,2,3', [1, 2])).toEqual(true);
    expect(evaluateIn([1, 2, 3], '1')).toEqual(true);
    expect(evaluateIn([1, 2, 3], '1')).toEqual(true);
    expect(evaluateIn([1, 2, 3], 1)).toEqual(true);
    expect(evaluateIn([1, 2, 3], '1,2')).toEqual(true);
    expect(evaluateIn([1, 2, 3], [1, 2])).toEqual(true);
    expect(evaluateIn('1.2.3', '1')).toEqual(false);
    expect(evaluateIn('1,2,3', true)).toEqual(false);
    expect(evaluateIn('1,2,3', '')).toEqual(false);
    expect(evaluateIn('1,2,3', undefined)).toEqual(false);
    expect(evaluateIn('1,2,3', null)).toEqual(false);
    expect(evaluateIn('1,2,3', 5)).toEqual(false);
    expect(evaluateIn('1,2,3', '5')).toEqual(false);
  });

  it('should evaluate between', () => {
    expect(evaluateBetween('1,5', '3')).toEqual(true);
    expect(evaluateBetween('1,5', 3)).toEqual(true);
    expect(evaluateBetween('1954-10-03,1960-06-06', '1955-10-04')).toEqual(true);
    expect(evaluateBetween('1,5', 55)).toEqual(false);
    expect(evaluateBetween('1,5', '03')).toEqual(true);
    expect(evaluateBetween('1,5', '0,3')).toEqual(false);
  });

  it('should evaluate', () => {
    const queryRaw: RuleGroup = {
      id: '6533cb2b-f78c-4558-b9ae-ca4a16946680',
      combinator: 'and',
      rules: [
        {
          id: '1d6e3fe0-ea9c-4761-8a00-7c4f3b03fb7b',
          field: 'firstName',
          value: 'Stev',
          operator: 'beginsWith'
        },
        {
          id: '6c54e5ee-c982-4373-833d-1ae4887d5c10',
          field: 'lastName',
          value: 'Vai, Vaughan',
          operator: 'in'
        },
        {
          id: '0c9054ab-b8bd-4880-91b3-c9d4a70d2977',
          field: 'age',
          operator: '>',
          value: '28'
        },
        {
          id: '8949338f-2d87-408c-947d-f7eab73b505e',
          combinator: 'or',
          rules: [
            {
              id: '21b87854-8a51-4957-8b7d-87e2e2f35a88',
              field: 'isMusician',
              operator: '=',
              value: true
            },
            {
              id: '4a9352d7-9756-4096-b655-64fafb551cb0',
              field: 'instrument',
              operator: '=',
              value: 'Guitar'
            },
            {
              id: '4a9352d7-9756-4096-b655-64fafb551cb0',
              field: 'nested.gender',
              operator: '=',
              value: 'Male'
            }
          ]
        },
        {
          id: 'fbd73b31-d57f-4e1c-8175-e2fe5f12fae7',
          field: 'birthdate',
          operator: 'between',
          value: '1954-10-03,1960-06-06'
        },
        {
          id: 'bd73b31-d57f-4e1c-8175-e2fe5f12fat',
          field: 'firstName_repeat',
          value: 'Stev',
          operator: 'beginsWith'
        },
        {
          id: 'bd73b31-d57f-4e1c-8175-e2fe5f12fa2',
          field: 'firstName',
          operator: '=',
          isBinding: true,
          value: 'firstName_repeat'
        }
      ]
    };

    let isValid = QueryBuilderEvaluator(
      queryRaw,
      {
        firstName: 'Steven',
        lastName: 'Vai',
        age: '29',
        isMusician: true,
        instrument: '',
        birthdate: '1955-10-04',
        nested: { gender: 'Male' },
        firstName_repeat: 'Steven'
      },
      true
    );
    expect(isValid).toEqual([true, true, true, [true, false, true], true, true, true]);

    isValid = QueryBuilderEvaluator(queryRaw, {
      firstName: 'Steven',
      lastName: 'Vai',
      age: '29',
      isMusician: true,
      instrument: '',
      birthdate: '1955-10-04',
      firstName_repeat: 'Steven'
    });
    expect(isValid).toEqual(true);

    isValid = QueryBuilderEvaluator(queryRaw, {
      firstName: 'Steven',
      lastName: 'Vai',
      age: '29',
      isMusician: false,
      instrument: '',
      birthdate: '1955-10-04'
    });
    expect(isValid).toEqual(false);

    isValid = QueryBuilderEvaluator(queryRaw, {
      firstName: 'Steven',
      lastName: 'Vai',
      age: '29',
      isMusician: true,
      instrument: '',
      birthdate: '1995-10-04'
    });
    expect(isValid).toEqual(false);

    isValid = QueryBuilderEvaluator(queryRaw, {
      firstName: 'Tester',
      lastName: 'Vai',
      age: '29',
      isMusician: true,
      instrument: '',
      birthdate: '1955-10-04'
    });
    expect(isValid).toEqual(false);

    isValid = QueryBuilderEvaluator(queryRaw, {});
    expect(isValid).toEqual(false);

    isValid = QueryBuilderEvaluator(queryRaw, undefined);
    expect(isValid).toEqual(false);

    isValid = QueryBuilderEvaluator(queryRaw, null);
    expect(isValid).toEqual(false);

    isValid = QueryBuilderEvaluator([], {
      firstName: 'Steven',
      lastName: 'Vai',
      age: '29',
      isMusician: true,
      instrument: '',
      birthdate: '1955-10-04',
      firstName_repeat: 'Steven'
    });
    expect(isValid).toEqual(true);

    isValid = QueryBuilderEvaluator(
      {},
      {
        firstName: 'Steven',
        lastName: 'Vai',
        age: '29',
        isMusician: true,
        instrument: '',
        birthdate: '1955-10-04',
        firstName_repeat: 'Steven'
      }
    );
    expect(isValid).toEqual(true);

    isValid = QueryBuilderEvaluator(null, {
      firstName: 'Steven',
      lastName: 'Vai',
      age: '29',
      isMusician: true,
      instrument: '',
      birthdate: '1955-10-04',
      firstName_repeat: 'Steven'
    });
    expect(isValid).toEqual(true);

    isValid = QueryBuilderEvaluator(123, {
      firstName: 'Steven',
      lastName: 'Vai',
      age: '29',
      isMusician: true,
      instrument: '',
      birthdate: '1955-10-04',
      firstName_repeat: 'Steven'
    });
    expect(isValid).toEqual(true);

    isValid = QueryBuilderEvaluator(undefined, {
      firstName: 'Steven',
      lastName: 'Vai',
      age: '29',
      isMusician: true,
      instrument: '',
      birthdate: '1955-10-04',
      firstName_repeat: 'Steven'
    });
    expect(isValid).toEqual(true);

    isValid = QueryBuilderEvaluator('qwe', {
      firstName: 'Steven',
      lastName: 'Vai',
      age: '29',
      isMusician: true,
      instrument: '',
      birthdate: '1955-10-04',
      firstName_repeat: 'Steven'
    });
    expect(isValid).toEqual(true);
  });

  it('should evaluate complex in', () => {
    const queryRaw: RuleGroup = {
      id: 'b643ebea-4ed3-4ad7-b1d8-d6c3f96322d2',
      combinator: 'and',
      rules: [
        {
          id: '64a695d5-12be-4e00-808d-3ac9920ba9e1',
          field: 'user.details.permissions',
          operator: 'in',
          value: 'spaceIndex'
        }
      ]
    };

    const isValid = QueryBuilderEvaluator(queryRaw, {
      user: {
        isAuthenticated: true,
        accessToken: '',
        details: {
          username: 'demo',
          email: 'demo@demo.com',
          permissions: ['siteIndex', 'spaceDelete', 'spaceIndex', 'spaceUpdate', 'spaceView'],
          verified: true,
          id: 0
        }
      }
    });
    expect(isValid).toEqual(true);
  });

  it('should evaluate nested objects', () => {
    const queryRaw: RuleGroup = {
      id: '6533cb2b-f78c-4558-b9ae-ca4a16946680',
      combinator: 'and',
      rules: [
        {
          id: '1d6e3fe0-ea9c-4761-8a00-7c4f3b03fb7b',
          field: 'nested.firstName',
          value: 'Stev',
          operator: 'beginsWith'
        },
        {
          id: '6c54e5ee-c982-4373-833d-1ae4887d5c10',
          field: 'nested.lastName',
          value: 'Vai, Vaughan',
          operator: 'in'
        },
        {
          id: '0c9054ab-b8bd-4880-91b3-c9d4a70d2977',
          field: 'nested.age',
          operator: '>',
          value: '28'
        },
        {
          id: '8949338f-2d87-408c-947d-f7eab73b505e',
          combinator: 'or',
          rules: [
            {
              id: '21b87854-8a51-4957-8b7d-87e2e2f35a88',
              field: 'nested.isMusician',
              operator: '=',
              value: true
            },
            {
              id: '4a9352d7-9756-4096-b655-64fafb551cb0',
              field: 'nested.instrument',
              operator: '=',
              value: 'Guitar'
            }
          ]
        },
        {
          id: 'fbd73b31-d57f-4e1c-8175-e2fe5f12fae7',
          field: 'nested.birthdate',
          operator: 'between',
          value: '1954-10-03,1960-06-06'
        }
      ]
    };

    let isValid = QueryBuilderEvaluator(
      queryRaw,
      {
        nested: {
          firstName: 'Steven',
          lastName: 'Vai',
          age: '29',
          isMusician: true,
          instrument: '',
          birthdate: '1955-10-04'
        }
      },
      true
    );
    expect(isValid).toEqual([true, true, true, [true, false], true]);

    isValid = QueryBuilderEvaluator(queryRaw, {
      nested: {
        firstName: 'Steven',
        lastName: 'Vai',
        age: '29',
        isMusician: true,
        instrument: '',
        birthdate: '1955-10-04'
      }
    });
    expect(isValid).toEqual(true);
  });

  it('should evaluete to formatter', () => {
    expect(QueryBuilderFormatter(undefined, 'mongodb')).toStrictEqual({});
    expect(QueryBuilderFormatter(undefined, 'sql')).toStrictEqual('');

    let queryRaw: RuleGroup = {
      id: '6533cb2b-f78c-4558-b9ae-ca4a16946680',
      combinator: 'and',
      rules: [
        {
          id: '1d6e3fe0-ea9c-4761-8a00-7c4f3b03fb7b',
          field: 'firstName',
          value: 'Stev',
          operator: 'beginsWith'
        },
        {
          id: '6c54e5ee-c982-4373-833d-1ae4887d5c10',
          field: 'lastName',
          value: 'Vai, Vaughan',
          operator: 'in'
        },
        {
          id: '0c9054ab-b8bd-4880-91b3-c9d4a70d2977',
          field: 'age',
          operator: '>',
          value: '28'
        },
        {
          id: '8949338f-2d87-408c-947d-f7eab73b505e',
          combinator: 'or',
          rules: [
            {
              id: '21b87854-8a51-4957-8b7d-87e2e2f35a88',
              field: 'isMusician',
              operator: '=',
              value: true
            },
            {
              id: '4a9352d7-9756-4096-b655-64fafb551cb0',
              field: 'instrument',
              operator: '=',
              value: 'Guitar'
            }
          ]
        },
        {
          id: 'fbd73b31-d57f-4e1c-8175-e2fe5f12fae7',
          field: 'birthdate',
          operator: 'between',
          value: '1954-10-03,1960-06-06'
        }
      ]
    };

    expect(QueryBuilderFormatter(queryRaw)).toBe(
      "firstName like 'Stev%' and lastName in ('Vai', 'Vaughan') and age > 28 and (isMusician = TRUE or instrument = 'Guitar') and birthdate between DATE '1954-10-03' and '1960-06-06'"
    );
    expect(QueryBuilderFormatter(queryRaw, 'mongodb')).toStrictEqual({
      $and: [
        { firstName: { $regex: '^Stev', $options: 'i' } },
        { lastName: { $in: ['Vai', 'Vaughan'] } },
        { age: { $gt: 28 } },
        { $or: [{ isMusician: true }, { instrument: 'Guitar' }] },
        { birthdate: { $gte: new Date('1954-10-03'), $lte: new Date('1960-06-06') } }
      ]
    });

    queryRaw = {
      id: '6533cb2b-f78c-4558-b9ae-ca4a16946680',
      combinator: 'and',
      rules: [
        {
          id: '1d6e3fe0-ea9c-4761-8a00-7c4f3b03fb7b',
          field: 'firstName',
          value: 'Stev',
          operator: 'doesNotBeginWith'
        }
      ]
    };

    expect(QueryBuilderFormatter(queryRaw)).toBe("firstName not like 'Stev%'");
    expect(QueryBuilderFormatter(queryRaw, 'mongodb')).toStrictEqual({
      firstName: { $not: { $regex: '^Stev', $options: 'i' } }
    });

    queryRaw = {
      id: '6533cb2b-f78c-4558-b9ae-ca4a16946680',
      combinator: 'and',
      rules: [
        {
          id: '1d6e3fe0-ea9c-4761-8a00-7c4f3b03fb7b',
          field: 'firstName',
          value: '',
          operator: 'empty'
        },
        {
          id: '6c54e5ee-c982-4373-833d-1ae4887d5c10',
          field: 'lastName',
          value: '',
          operator: 'notEmpty'
        }
      ]
    };

    expect(QueryBuilderFormatter(queryRaw)).toBe('firstName is NULL and lastName is not NULL');
    expect(QueryBuilderFormatter(queryRaw, 'mongodb')).toStrictEqual({
      $and: [{ firstName: '' }, { lastName: { $ne: '' } }]
    });

    queryRaw = {} as RuleGroup;

    expect(QueryBuilderFormatter(queryRaw)).toBe('');
    expect(QueryBuilderFormatter(queryRaw, 'mongodb')).toStrictEqual({});

    queryRaw = {
      id: '6533cb2b-f78c-4558-b9ae-ca4a16946680',
      combinator: 'and',
      rules: []
    };

    expect(QueryBuilderFormatter(queryRaw)).toBe('');
    expect(QueryBuilderFormatter(queryRaw, 'mongodb')).toStrictEqual({});

    queryRaw = {
      id: 'b643ebea-4ed3-4ad7-b1d8-d6c3f96322d2',
      combinator: 'and',
      rules: [
        {
          id: '64a695d5-12be-4e00-808d-3ac9920ba9e1',
          field: 'user.permissions',
          operator: 'in',
          value: 'spaceIndex'
        }
      ]
    };

    expect(QueryBuilderFormatter(queryRaw)).toBe("user.permissions in ('spaceIndex')");
    expect(QueryBuilderFormatter(queryRaw, 'mongodb')).toStrictEqual({ 'user.permissions': { $in: ['spaceIndex'] } });

    queryRaw = {
      id: '6533cb2b-f78c-4558-b9ae-ca4a16946680',
      combinator: 'and',
      rules: [
        {
          id: '1d6e3fe0-ea9c-4761-8a00-7c4f3b03fb7b',
          field: 'firstName',
          value: '',
          operator: 'empty',
          enabled: false
        },
        {
          id: '6c54e5ee-c982-4373-833d-1ae4887d5c10',
          field: 'lastName',
          value: '',
          operator: 'notEmpty'
        }
      ]
    };

    expect(QueryBuilderFormatter(queryRaw)).toBe('lastName is not NULL');
    expect(QueryBuilderFormatter(queryRaw, 'mongodb')).toStrictEqual({ lastName: { $ne: '' } });

    queryRaw = {
      id: '6533cb2b-f78c-4558-b9ae-ca4a16946680',
      combinator: 'and',
      rules: [
        {
          id: '1d6e3fe0-ea9c-4761-8a00-7c4f3b03fb7b',
          field: 'firstName',
          value: '',
          operator: 'empty'
        },
        {
          id: '6c54e5ee-c982-4373-833d-1ae4887d5c10',
          field: 'lastName',
          value: '',
          operator: 'notEmpty',
          enabled: false
        }
      ]
    };

    expect(QueryBuilderFormatter(queryRaw)).toBe('firstName is NULL');
    expect(QueryBuilderFormatter(queryRaw, 'mongodb')).toStrictEqual({ firstName: '' });

    queryRaw = {
      id: '6533cb2b-f78c-4558-b9ae-ca4a16946680',
      combinator: 'and',
      rules: [
        {
          id: '1d6e3fe0-ea9c-4761-8a00-7c4f3b03fb7b',
          field: 'firstName',
          value: '',
          operator: 'empty',
          enabled: false
        },
        {
          id: '6c54e5ee-c982-4373-833d-1ae4887d5c10',
          field: 'lastName',
          value: '',
          operator: 'notEmpty',
          enabled: false
        }
      ]
    };

    expect(QueryBuilderFormatter(queryRaw)).toBe('');
    expect(QueryBuilderFormatter(queryRaw, 'mongodb')).toStrictEqual({});

    queryRaw = {
      id: '6533cb2b-f78c-4558-b9ae-ca4a16946680',
      combinator: 'and',
      enabled: false,
      rules: [
        {
          id: '1d6e3fe0-ea9c-4761-8a00-7c4f3b03fb7b',
          field: 'firstName',
          value: '',
          operator: 'empty'
        },
        {
          id: '6c54e5ee-c982-4373-833d-1ae4887d5c10',
          field: 'lastName',
          value: '',
          operator: 'notEmpty'
        }
      ]
    };

    expect(QueryBuilderFormatter(queryRaw)).toBe('');
    expect(QueryBuilderFormatter(queryRaw, 'mongodb')).toStrictEqual({});

    queryRaw = {
      id: '6533cb2b-f78c-4558-b9ae-ca4a16946680',
      combinator: 'and',
      enabled: true,
      rules: [
        {
          id: '1d6e3fe0-ea9c-4761-8a00-7c4f3b03fb7b',
          field: 'values.email',
          value: 'test@example.com',
          operator: '='
        },
        {
          id: '6c54e5ee-c982-4373-833d-1ae4887d5c10',
          field: '_id',
          value: 'qs123',
          operator: '='
        }
      ]
    };

    expect(QueryBuilderFormatter(queryRaw)).toBe("values.email = 'test@example.com' and _id = 'qs123'");
    expect(QueryBuilderFormatter(queryRaw, 'mongodb')).toStrictEqual({
      $and: [
        {
          'values.email': 'test@example.com'
        },
        {
          _id: 'qs123'
        }
      ]
    });

    queryRaw = {
      id: '6533cb2b-f78c-4558-b9ae-ca4a16946680',
      combinator: 'and',
      enabled: true,
      rules: [
        {
          id: 'bd73b31-d57f-4e1c-8175-e2fe5f12fat',
          field: 'firstName_repeat',
          value: 'Stev',
          operator: 'beginsWith',
          enabled: true
        },
        {
          id: 'bd73b31-d57f-4e1c-8175-e2fe5f12fa2',
          field: 'firstName',
          operator: '=',
          isBinding: true,
          value: 'firstName_repeat'
        }
      ]
    };
    expect(QueryBuilderFormatter(queryRaw, 'sql', false, { firstName_repeat: 'test' })).toBe(
      "firstName_repeat like 'Stev%' and firstName = 'test'"
    );
    expect(QueryBuilderFormatter(queryRaw, 'mongodb', false, { firstName_repeat: 'test' })).toStrictEqual({
      $and: [
        {
          firstName_repeat: {
            $options: 'i',
            $regex: '^Stev'
          }
        },
        {
          firstName: 'test'
        }
      ]
    });
  });

  it('should evaluate and some are disabled', () => {
    const queryRaw: RuleGroup = {
      id: '6533cb2b-f78c-4558-b9ae-ca4a16946680',
      combinator: 'and',
      rules: [
        {
          id: '1d6e3fe0-ea9c-4761-8a00-7c4f3b03fb7b',
          field: 'firstName',
          value: 'Stev',
          operator: 'beginsWith'
        },
        {
          id: '6c54e5ee-c982-4373-833d-1ae4887d5c10',
          field: 'lastName',
          value: 'Vai, Vaughan',
          operator: 'in'
        },
        {
          id: '0c9054ab-b8bd-4880-91b3-c9d4a70d2977',
          field: 'age',
          operator: '>',
          value: '28'
        },
        {
          id: '8949338f-2d87-408c-947d-f7eab73b505e',
          combinator: 'or',
          enabled: false,
          rules: [
            {
              id: '21b87854-8a51-4957-8b7d-87e2e2f35a88',
              field: 'isMusician',
              operator: '=',
              value: true
            },
            {
              id: '4a9352d7-9756-4096-b655-64fafb551cb0',
              field: 'instrument',
              operator: '=',
              value: 'Guitar'
            },
            {
              id: '4a9352d7-9756-4096-b655-64fafb551cb0',
              field: 'nested.gender',
              operator: '=',
              value: 'Male'
            }
          ]
        },
        {
          id: 'fbd73b31-d57f-4e1c-8175-e2fe5f12fae7',
          field: 'birthdate',
          operator: 'between',
          value: '1954-10-03,1960-06-06'
        },
        {
          id: 'bd73b31-d57f-4e1c-8175-e2fe5f12fat',
          field: 'firstName_repeat',
          value: 'Stev',
          operator: 'beginsWith',
          enabled: false
        },
        {
          id: 'bd73b31-d57f-4e1c-8175-e2fe5f12fa2',
          field: 'firstName',
          operator: '=',
          isBinding: true,
          value: 'firstName_repeat'
        }
      ]
    };

    let isValid = QueryBuilderEvaluator(
      queryRaw,
      {
        firstName: 'Steven',
        lastName: 'Vai',
        age: '29',
        isMusician: true,
        instrument: '',
        birthdate: '1955-10-04',
        nested: { gender: 'Male' },
        firstName_repeat: 'Steven'
      },
      true
    );
    expect(isValid).toEqual([true, true, true, true, true]);

    isValid = QueryBuilderEvaluator(queryRaw, {
      firstName: 'Steven',
      lastName: 'Vai',
      age: '29',
      isMusician: true,
      instrument: '',
      birthdate: '1955-10-04',
      firstName_repeat: 'Steven'
    });
    expect(isValid).toEqual(true);
  });

  it('should getValuesRequired', () => {
    const queryRaw: RuleGroup = {
      id: '6533cb2b-f78c-4558-b9ae-ca4a16946680',
      combinator: 'and',
      rules: [
        {
          id: '1d6e3fe0-ea9c-4761-8a00-7c4f3b03fb7b',
          field: 'nested.firstName',
          value: 'Stev',
          operator: 'beginsWith'
        },
        {
          id: '6c54e5ee-c982-4373-833d-1ae4887d5c10',
          field: 'nested.lastName',
          value: 'Vai, Vaughan',
          operator: 'in'
        },
        {
          id: '0c9054ab-b8bd-4880-91b3-c9d4a70d2977',
          field: 'nested.age',
          operator: '>',
          value: '28'
        },
        {
          id: '8949338f-2d87-408c-947d-f7eab73b505e',
          combinator: 'or',
          rules: [
            {
              id: '21b87854-8a51-4957-8b7d-87e2e2f35a88',
              field: 'nested.isMusician',
              operator: '=',
              value: true
            },
            {
              id: '4a9352d7-9756-4096-b655-64fafb551cb0',
              field: 'nested.instrument',
              operator: '=',
              value: 'Guitar'
            }
          ]
        },
        {
          id: 'fbd73b31-d57f-4e1c-8175-e2fe5f12fae7',
          field: 'nested.birthdate',
          operator: 'between',
          value: '1954-10-03,1960-06-06'
        }
      ]
    };

    let previewValues = getValuesRequired(queryRaw, {
      nested: {
        firstName: 'Steven',
        lastName: 'Vai',
        age: '29',
        isMusician: true,
        instrument: '',
        birthdate: '1955-10-04',
        fakeVariable: 'isNotUsed',
        nested2: {
          fakeVariable2: 'isNotUsed2'
        }
      }
    });
    expect(previewValues).toEqual({
      nested: {
        firstName: 'Steven',
        lastName: 'Vai',
        age: '29',
        isMusician: true,
        instrument: '',
        birthdate: '1955-10-04'
      }
    });

    previewValues = getValuesRequired(queryRaw, {
      nested: {
        // firstName: 'Steven',
        // lastName: 'Vai',
        age: '29',
        isMusician: true,
        instrument: '',
        birthdate: '1955-10-04',
        fakeVariable: 'isNotUsed',
        nested2: {
          fakeVariable2: 'isNotUsed2'
        }
      }
    });
    expect(previewValues).toEqual({
      nested: {
        firstName: undefined,
        lastName: undefined,
        age: '29',
        isMusician: true,
        instrument: '',
        birthdate: '1955-10-04'
      }
    });

    previewValues = getValuesRequired(
      queryRaw,
      {
        nested: {
          // firstName: 'Steven',
          // lastName: 'Vai',
          age: '29',
          isMusician: true,
          instrument: '',
          birthdate: '1955-10-04',
          fakeVariable: 'isNotUsed',
          nested2: {
            fakeVariable2: 'isNotUsed2'
          }
        }
      },
      undefined
    );
    expect(previewValues).toEqual({
      nested: {
        firstName: null,
        lastName: null,
        age: '29',
        isMusician: true,
        instrument: '',
        birthdate: '1955-10-04'
      }
    });
  });
});
