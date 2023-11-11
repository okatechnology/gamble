import { BaccaratPickedCards } from 'src/baccarat/types/baccaratPickedCards';
import { BaccaratResult } from 'src/baccarat/types/baccaratResult';

const calculateResult = ({
  banker,
  player,
}: {
  banker: number;
  player: number;
}): BaccaratResult => {
  if (banker > player) {
    return 'B';
  } else if (banker < player) {
    return 'P';
  } else {
    return 'T';
  }
};

export const playBaccarat = ({
  bankerFirstCard,
  bankerSecondCard,
  bankerThirdCard,
  playerFirstCard,
  playerSecondCard,
  playerThirdCard,
}: BaccaratPickedCards): BaccaratResult => {
  const playerFirstPoints = (playerFirstCard + playerSecondCard) % 10;
  const bankerFirstPoints = (bankerFirstCard + bankerSecondCard) % 10;

  // どちらも3枚目を引かない場合
  if (
    bankerFirstPoints >= 8 ||
    playerFirstPoints >= 8 ||
    ((bankerFirstPoints === 6 || bankerFirstPoints === 7) &&
      (playerFirstPoints === 6 || playerFirstPoints === 7))
  ) {
    return calculateResult({ banker: bankerFirstPoints, player: playerFirstPoints });
  }

  // バンカーに3枚目を引かせる場合
  if (playerFirstPoints === 6 || playerFirstPoints === 7) {
    const bankerFinalPoints = (bankerFirstPoints + bankerThirdCard) % 10;

    return calculateResult({ banker: bankerFinalPoints, player: playerFirstPoints });
  }

  // プレイヤーに3枚目を引かせる場合
  if (bankerFirstPoints >= 3) {
    const playerFinalPoints = (playerFirstPoints + playerThirdCard) % 10;

    // バンカーに3枚目を引かせる場合
    if (
      (bankerFirstPoints === 3 && playerThirdCard !== 8) ||
      (bankerFirstPoints === 4 && playerThirdCard >= 2 && playerThirdCard < 8) ||
      (bankerFirstPoints === 5 && playerThirdCard >= 4 && playerThirdCard < 8) ||
      (bankerFirstPoints === 6 && (playerThirdCard === 6 || playerThirdCard === 7))
    ) {
      const bankerFinalPoints = (bankerFirstPoints + bankerThirdCard) % 10;

      return calculateResult({ banker: bankerFinalPoints, player: playerFinalPoints });
    }

    return calculateResult({
      banker: bankerFirstPoints,
      player: playerFinalPoints,
    });
  }

  // バンカー・プレイヤーともに3枚目を引かせる場合
  const playerFinalPoints = (playerFirstPoints + playerThirdCard) % 10;
  const bankerFinalPoints = (bankerFirstPoints + bankerThirdCard) % 10;

  return calculateResult({ banker: bankerFinalPoints, player: playerFinalPoints });
};
