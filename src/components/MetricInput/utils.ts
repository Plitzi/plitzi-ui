export const generateRegexFromWord = (words: string | string[], asSubRegex = false): RegExp => {
  if (typeof words === 'string') {
    words = [words];
  }

  const fragments: string[] = [];
  words.forEach(word => {
    const fragment = word
      .split('')
      .map((_, index) => word.substring(0, index + 1))
      .join('|');

    fragments.push(`(${fragment})`);
  });

  if (fragments.length === 1 && !asSubRegex) {
    return new RegExp(`^${fragments[0]}$`);
  }

  if (fragments.length === 1) {
    return new RegExp(fragments[0]);
  }

  if (!asSubRegex) {
    return new RegExp(`^(${fragments.join('|')})$`);
  }

  return new RegExp(`(${fragments.join('|')})`);
};

export const generateAllowedWordsRegex = (words: string[] = []) =>
  words.length > 0 ? generateRegexFromWord(words, true) : undefined;

export const generateMetricRegex = (units: { value: string; label: string }[], allowedWordRegex?: RegExp) => {
  let amountRegex = '(?<amount>[0-9]+(\\.|\\.[0-9]+|))';
  if (allowedWordRegex) {
    amountRegex = `(?<amount>([0-9]+(\\.|\\.[0-9]+|)|${allowedWordRegex.source}))`;
  }

  if (units.length > 0) {
    const unitRegex = `(?<unit>${units.map(unit => unit.value).join('|')})`;

    return new RegExp(`^${amountRegex}${unitRegex}$`, 'im');
  }

  return new RegExp(`^${amountRegex}$`, 'im');
};
