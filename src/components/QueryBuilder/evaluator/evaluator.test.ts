import fs from 'node:fs';
import path from 'node:path';

import { describe, expect, it } from 'vitest';

import { isRuleGroup, QueryBuilderEvaluator } from '.';

import type { RuleGroup } from '.';

const SRC = path.resolve(import.meta.dirname, '../../..');

/** Every module the entry loads, following value imports (`import type` loads nothing) through `@/` and relative paths. */
const loaded = (file: string, seen = new Set<string>()): Set<string> => {
  if (seen.has(file)) {
    return seen;
  }

  seen.add(file);
  const text = fs.readFileSync(file, 'utf-8');
  for (const [, specifier] of text.matchAll(/^(?:import|export)\s+(?!type\b)[^'"]*?from\s+'([^']+)'/gm)) {
    const base = specifier.startsWith('@/')
      ? path.join(SRC, specifier.slice(2))
      : specifier.startsWith('.')
        ? path.resolve(path.dirname(file), specifier)
        : undefined;
    const found = base && [`${base}.ts`, `${base}.tsx`, path.join(base, 'index.ts')].find(each => fs.existsSync(each));
    if (found) {
      loaded(found, seen);
    }
  }

  return seen;
};

describe('QueryBuilder/evaluator', () => {
  it('evaluates a rule group', () => {
    const group: RuleGroup = {
      combinator: 'and',
      rules: [{ field: 'plan', operator: '=', value: 'pro' }]
    };

    expect(isRuleGroup(group)).toBe(true);
    expect(Boolean(QueryBuilderEvaluator(group, { plan: 'pro' }))).toBe(true);
    expect(Boolean(QueryBuilderEvaluator(group, { plan: 'free' }))).toBe(false);
  });

  /** What the entry is for: a server evaluating rules loads neither the editor nor the query formatters. */
  it('loads no component and no formatter', () => {
    const files = [...loaded(path.join(import.meta.dirname, 'index.ts'))].map(file => path.relative(SRC, file));

    expect(
      files.filter(file => file.endsWith('.tsx') || file.includes('formatter') || file.includes('Formatter'))
    ).toEqual([]);
  });
});
