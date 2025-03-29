export const generateRegexFromWord = (words?: string | string[], asSubRegex = false): RegExp | undefined => {
  if (!words) {
    return undefined;
  }

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

export const generateMetricRegex = (units: { value: string; label: string }[], allowedWords?: string[]) => {
  const allowedWordsRegex =
    allowedWords && allowedWords.length > 0 ? generateRegexFromWord(allowedWords, true) : undefined;
  let amountRegex = '(?<amount>[0-9]+(\\.|\\.[0-9]+|))';
  if (allowedWordsRegex) {
    amountRegex = `(?<amount>([0-9]+(\\.|\\.[0-9]+|)|${allowedWordsRegex.source}))`;
  }

  if (units.length > 0) {
    const unitRegex = `(?<unit>${units.map(unit => unit.value).join('|')})`;

    return new RegExp(`^${amountRegex}${unitRegex}$`, 'im');
  }

  return new RegExp(`^${amountRegex}$`, 'im');
};
