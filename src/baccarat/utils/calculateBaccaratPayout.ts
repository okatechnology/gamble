import {
  ODDS_OF_BANKER_WINNING,
  ODDS_OF_PLAYER_WINNING,
  ODDS_OF_TIE,
} from 'src/baccarat/constants/baccaratGlobalConfig';
import { BaccaratResult } from 'src/baccarat/types/baccaratResult';
import { pickSixCards } from 'src/baccarat/utils/pickSixCards';
import { playBaccarat } from 'src/baccarat/utils/playBaccarat';

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
    return betAmount * ODDS_OF_BANKER_WINNING;
  } else if (result === betTarget && result === 'P') {
    return betAmount * ODDS_OF_PLAYER_WINNING;
  } else if (result === betTarget && result === 'T') {
    return betAmount * ODDS_OF_TIE;
  } else if (result === 'T') {
    return betAmount;
  } else {
    return 0;
  }
};
