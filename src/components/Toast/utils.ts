export const generateUEID = () => {
  let first: number | string = (Math.random() * 46656) | 0;
  let second: number | string = (Math.random() * 46656) | 0;
  first = `000${first.toString(36)}`.slice(-3);
  second = `000${second.toString(36)}`.slice(-3);

  return first + second;
};
