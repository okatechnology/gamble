import { BaccaratResult } from 'src/baccarat/types/baccaratResult';
import { pickSixCards } from 'src/baccarat/utils/pickSixCards';
import { playBaccarat } from 'src/baccarat/utils/playBaccarat';

const BANKER_ODDS = 1.95;
const PLAYER_ODDS = 2;
const TIE_ODDS = 8;

export const calculateBaccaratPayout = ({
  betTarget,
  betAmount,
}: {
  betTarget: BaccaratResult;
  betAmount: number;
}) => {
  const sixCards = pickSixCards();
  const result = playBaccarat(sixCards);

  if (result === betTarget && result === 'B') {
    return betAmount * BANKER_ODDS;
  } else if (result === betTarget && result === 'P') {
    return betAmount * PLAYER_ODDS;
  } else if (result === betTarget && result === 'T') {
    return betAmount * TIE_ODDS;
  } else if (result === 'T') {
    return betAmount;
  } else {
    return 0;
  }
};
