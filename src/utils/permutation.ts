type Permutation = (n: number, r: number) => number;

export const permutation: Permutation = (n, r) => {
  let result = 1;

  for (let i = 0; i < r; i++) {
    result *= n - i;
  }

  return result;
};
