import { DECKS, SUITES } from 'src/baccarat/baccaratGlobalConfig';
import { BaccaratPickedCards } from 'src/baccarat/types/baccaratPickedCards';

type PickSixCards = () => BaccaratPickedCards;

const cards = Array.from({ length: 13 }, (_, i) => {
  const cardNumber = i + 1;

  return cardNumber >= 10 ? 0 : cardNumber; // 0 is for 10, J, Q, K
}).flatMap((cardNumber) =>
  Array.from(
    {
      length: SUITES * DECKS, // 4 suits * decks
    },
    () => cardNumber,
  ),
);

export const pickSixCards: PickSixCards = () => {
  const cardsCopy = [...cards];
  const firstCardIndex = Math.floor(Math.random() * cards.length);
  const playerFirstCard = cardsCopy.splice(firstCardIndex, 1)[0];
  const secondCardIndex = Math.floor(Math.random() * (cards.length - 1));
  const playerSecondCard = cardsCopy.splice(secondCardIndex, 1)[0];
  const thirdCardIndex = Math.floor(Math.random() * (cards.length - 2));
  const playerThirdCard = cardsCopy.splice(thirdCardIndex, 1)[0];
  const fourthCardIndex = Math.floor(Math.random() * (cards.length - 3));
  const bankerFirstCard = cardsCopy.splice(fourthCardIndex, 1)[0];
  const fifthCardIndex = Math.floor(Math.random() * (cards.length - 4));
  const bankerSecondCard = cardsCopy.splice(fifthCardIndex, 1)[0];
  const sixthCardIndex = Math.floor(Math.random() * (cards.length - 5));
  const bankerThirdCard = cardsCopy.splice(sixthCardIndex, 1)[0];

  if (
    playerFirstCard == null ||
    playerSecondCard == null ||
    playerThirdCard == null ||
    bankerFirstCard == null ||
    bankerSecondCard == null ||
    bankerThirdCard == null
  ) {
    throw new Error('card is null');
  }

  return {
    playerFirstCard,
    playerSecondCard,
    playerThirdCard,
    bankerFirstCard,
    bankerSecondCard,
    bankerThirdCard,
  };
};
