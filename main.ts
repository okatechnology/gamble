import fs from 'fs';

type BaccaratResult = 'B' | 'P' | 'T';

const main = () => {
  runBaccarat();
};

const runBaccarat = () => {
  const cards = Array.from({ length: 13 }, (_, i) => {
    const cardNumber = i + 1;

    return cardNumber >= 10 ? 0 : cardNumber; // 0 is for 10, J, Q, K
  }).flatMap((cardNumber) =>
    Array.from(
      {
        length: 32, // 4 suits * 8 decks
      },
      () => cardNumber,
    ),
  );

  const pickSixCards = () => {
    const cardsCopy = [...cards];
    const firstCardIndex = Math.floor(Math.random() * cards.length);
    const firstCard = cardsCopy.splice(firstCardIndex, 1)[0];
    const secondCardIndex = Math.floor(Math.random() * (cards.length - 1));
    const secondCard = cardsCopy.splice(secondCardIndex, 1)[0];
    const thirdCardIndex = Math.floor(Math.random() * (cards.length - 2));
    const thirdCard = cardsCopy.splice(thirdCardIndex, 1)[0];
    const fourthCardIndex = Math.floor(Math.random() * (cards.length - 3));
    const fourthCard = cardsCopy.splice(fourthCardIndex, 1)[0];
    const fifthCardIndex = Math.floor(Math.random() * (cards.length - 4));
    const fifthCard = cardsCopy.splice(fifthCardIndex, 1)[0];
    const sixthCardIndex = Math.floor(Math.random() * (cards.length - 5));
    const sixthCard = cardsCopy.splice(sixthCardIndex, 1)[0];

    if (
      firstCard == null ||
      secondCard == null ||
      thirdCard == null ||
      fourthCard == null ||
      fifthCard == null ||
      sixthCard == null
    ) {
      console.error('card is null');
    }

    return [
      firstCard ?? 0,
      secondCard ?? 0,
      thirdCard ?? 0,
      fourthCard ?? 0,
      fifthCard ?? 0,
      sixthCard ?? 0,
    ] as const;
  };

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

  const playGame = () => {
    const [firstCard, secondCard, thirdCard, fourthCard, fifthCard, sixthCard] = pickSixCards();
    const playerFirstPoints = (firstCard + thirdCard) % 10;
    const bankerFirstPoints = (secondCard + fourthCard) % 10;

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
      const bankerThirdCard = fifthCard;
      const bankerFinalPoints = (bankerFirstPoints + bankerThirdCard) % 10;

      return calculateResult({ banker: bankerFinalPoints, player: playerFirstPoints });
    }

    // プレイヤーに3枚目を引かせる場合
    if (bankerFirstPoints >= 3) {
      const playerThirdCard = fifthCard;
      const playerFinalPoints = (playerFirstPoints + playerThirdCard) % 10;

      // バンカーに3枚目を引かせる場合
      if (
        (bankerFirstPoints === 3 && playerThirdCard !== 8) ||
        (bankerFirstPoints === 4 && playerThirdCard >= 2 && playerThirdCard < 8) ||
        (bankerFirstPoints === 5 && playerThirdCard >= 4 && playerThirdCard < 8) ||
        (bankerFirstPoints === 6 && (playerThirdCard === 6 || playerThirdCard === 7))
      ) {
        const bankerThirdCard = sixthCard;
        const bankerFinalPoints = (bankerFirstPoints + bankerThirdCard) % 10;

        return calculateResult({ banker: bankerFinalPoints, player: playerFinalPoints });
      }

      return calculateResult({
        banker: bankerFirstPoints,
        player: playerFinalPoints,
      });
    }

    // バンカー・プレイヤーともに3枚目を引かせる場合
    const playerThirdCard = fifthCard;
    const playerFinalPoints = (playerFirstPoints + playerThirdCard) % 10;
    const bankerThirdCard = sixthCard;
    const bankerFinalPoints = (bankerFirstPoints + bankerThirdCard) % 10;

    return calculateResult({ banker: bankerFinalPoints, player: playerFinalPoints });
  };

  const calculatePayout = ({
    betTarget,
    betAmount,
  }: {
    betTarget: BaccaratResult;
    betAmount: number;
  }) => {
    const result = playGame();

    if (result === betTarget && result === 'B') {
      return betAmount * 1.95;
    } else if (result === betTarget && result === 'P') {
      return betAmount * 2;
    } else if (result === betTarget && result === 'T') {
      return betAmount * 8;
    } else if (result === 'T') {
      return betAmount;
    } else {
      return 0;
    }
  };

  const allResult: string[] = [];
  const MINIMUM_BET = 100;
  const FIRST_BANKROLL = 10000;

  let numberOfWin = 0;

  for (let i = 0; i < 100; i++) {
    let bankRoll = FIRST_BANKROLL;

    const personalResult: number[] = [];

    while (bankRoll > MINIMUM_BET && bankRoll < 2 * FIRST_BANKROLL) {
      const betAmount = 100;
      bankRoll -= betAmount;
      const payout = calculatePayout({ betTarget: 'B', betAmount });
      bankRoll += payout;
      personalResult.push(bankRoll);
    }

    if (bankRoll > 2 * FIRST_BANKROLL) {
      numberOfWin++;
    }

    // 重くなるので全員分はデータを出力しない
    if (i < 20) {
      allResult.push(personalResult.join(','));
    }
  }

  fs.writeFileSync('result/baccarat.csv', allResult.join('\n'));
  fs.writeFileSync('result/baccaratResult.txt', numberOfWin.toString());
};

main();
