import { describe, expect, test } from 'vitest';

import { generateRegexFromWord } from './utils';

describe('generateRegexFromWord', () => {
  const testCases = [
    { word: 'strong', valid: ['s', 'st', 'stro', 'stron', 'strong'], invalid: ['srt', 'strongx'] },
    { word: 'auto', valid: ['a', 'au', 'aut', 'auto'], invalid: ['autox'] },
    {
      word: 'invalid',
      valid: ['i', 'in', 'inv', 'inva', 'inval', 'invalid'],
      invalid: ['invalidx', 'nvalid', 'valid', '1nvalid']
    },
    { word: 'tester', valid: ['t', 'te', 'tes', 'test', 'teste', 'tester'], invalid: ['testerx'] },
    {
      word: 'hello world',
      valid: [
        'h',
        'he',
        'hel',
        'hell',
        'hello',
        'hello ',
        'hello w',
        'hello wo',
        'hello wor',
        'hello worl',
        'hello world'
      ],
      invalid: ['hello worldx']
    },
    {
      word: ['hello', 'world'],
      valid: ['h', 'he', 'hel', 'hell', 'hello', 'w', 'wo', 'wor', 'worl', 'world'],
      invalid: ['hellox', 'worldx']
    }
  ];

  testCases.forEach(({ word, valid, invalid }) => {
    test(`should generate a correct regex for "${Array.isArray(word) ? word.join(', ') : word}"`, () => {
      const regex = generateRegexFromWord(word);

      valid.forEach(str => {
        expect(regex.test(str)).toBe(true);
      });

      invalid.forEach(str => {
        expect(regex.test(str)).toBe(false);
      });
    });
  });
});
