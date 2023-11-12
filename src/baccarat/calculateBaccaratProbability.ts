import {
  SUITES,
  DECKS,
  ODDS_OF_PLAYER_WINNING,
  ODDS_OF_BANKER_WINNING,
  ODDS_OF_TIE,
} from 'src/baccarat/baccaratGlobalConfig';
import { BaccaratPickedCards } from 'src/baccarat/types/baccaratPickedCards';
import { playBaccarat } from 'src/baccarat/utils/playBaccarat';
import { permutation } from 'src/utils/permutation';

// カードの配り方を全てリストアップする
const allPickedCards = Array.from<unknown, BaccaratPickedCards>({ length: 1000000 }, (_, i) => {
  const cards = i.toString().padStart(6, '0').split('');

  return {
    playerFirstCard: Number(cards[0]),
    playerSecondCard: Number(cards[1]),
    playerThirdCard: Number(cards[2]),
    bankerFirstCard: Number(cards[3]),
    bankerSecondCard: Number(cards[4]),
    bankerThirdCard: Number(cards[5]),
  };
});

let playerWins = 0;

let bankerWins = 0;

let ties = 0;

allPickedCards.forEach((pickedCards) => {
  // 対象の配られ方にどの点数が何枚配られたかを数える
  const pickedCardsNumbersRecord = Object.values<number>(pickedCards).reduce(
    (previousList, currentCard) => {
      return {
        ...previousList,
        [currentCard]: (previousList[currentCard] ?? 0) + 1,
      };
    },
    {} as Record<number, number>,
  );

  // 対象の配られ方にどの点数が何枚配られたかから、その配られ方の組み合わせの数を計算する
  const combinationsOfPickedCards = Object.entries(pickedCardsNumbersRecord).reduce(
    (previousNumber, [cardNumber, count]) => {
      const numberOfTypesOfTheTargetNumbersCards = cardNumber === '0' ? 4 : 1;

      return (
        previousNumber * permutation(numberOfTypesOfTheTargetNumbersCards * SUITES * DECKS, count)
      );
    },
    1,
  );

  const winner = playBaccarat(pickedCards);

  // 対象の配られ方の組み合わせの数を、勝者に応じて加算する
  if (winner === 'P') {
    playerWins += combinationsOfPickedCards;
  } else if (winner === 'B') {
    bankerWins += combinationsOfPickedCards;
  } else {
    ties += combinationsOfPickedCards;
  }
});

const probabilityOfPlayerWinning = playerWins / (playerWins + bankerWins + ties);
const probabilityOfBankerWinning = bankerWins / (playerWins + bankerWins + ties);
const probabilityOfTie = ties / (playerWins + bankerWins + ties);
const probabilityOfPlayerWinningWithoutTies = playerWins / (playerWins + bankerWins);
const probabilityOfBankerWinningWithoutTies = bankerWins / (playerWins + bankerWins);

const expectedValueOfPlayerWinning =
  probabilityOfPlayerWinning * ODDS_OF_PLAYER_WINNING + probabilityOfTie * 1;

const expectedValueOfBankerWinning =
  probabilityOfBankerWinning * ODDS_OF_BANKER_WINNING + probabilityOfTie * 1;

const expectedValueOfTie = probabilityOfTie * ODDS_OF_TIE;

console.log(
  `プレイヤーが勝利するカードの組み合わせは${playerWins}通り、
バンカーが勝利するカードの組み合わせは${bankerWins}通り、
タイになるカードの組み合わせは${ties}通りある。

プレイヤーが勝利する確率は${probabilityOfPlayerWinning * 100}...%、
バンカーが勝利する確率は${probabilityOfBankerWinning * 100}...%、
タイになる確率は${probabilityOfTie * 100}...%である。

タイを除いた場合、プレイヤーが勝利する確率は${probabilityOfPlayerWinningWithoutTies * 100}...%、
バンカーが勝利する確率は${probabilityOfBankerWinningWithoutTies * 100}...%である。

賭け金を1とした場合、
プレイヤーが勝利する場合の賞金の期待値は${expectedValueOfPlayerWinning}...、
バンカーが勝利する場合の賞金の期待値は${expectedValueOfBankerWinning}...、
タイになる場合の賞金の期待値は${expectedValueOfTie}...である。
`,
);
