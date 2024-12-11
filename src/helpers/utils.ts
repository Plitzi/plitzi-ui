export const emptyObject = {};

export const emptyArray = [];

export const arrayDifference = <T>(array1: T[], array2: T[], resultType: 'left' | 'right' | 'both' = 'right') => {
  const set1 = new Set(array1);
  const set2 = new Set(array2);

  if (resultType === 'left') {
    const notInArray2 = [...set1].filter(value => !set2.has(value));

    return notInArray2;
  }

  if (resultType === 'right') {
    const notInArray1 = [...set2].filter(value => !set1.has(value));

    return notInArray1;
  }

  const notInArray2 = [...set1].filter(value => !set2.has(value));
  const notInArray1 = [...set2].filter(value => !set1.has(value));

  return [...notInArray2, ...notInArray1];
};
