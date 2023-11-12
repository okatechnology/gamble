/** 順序を考慮した組み合わせの数を求める */
export const permutation = <T extends number | bigint>(n: T, r: T): T => {
  let result = 1n;

  for (let i = 0n; i < r; i++) {
    result *= BigInt(n) - i;
  }

  if (typeof n === 'number') {
    return Number(result) as T;
  }

  return result as T;
};
