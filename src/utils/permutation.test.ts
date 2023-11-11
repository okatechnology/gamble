import { permutation } from 'src/utils/permutation';

test('10個あるものを3個並べる組み合わせは720通り', () => {
  expect(permutation(10, 3)).toBe(720);
});
