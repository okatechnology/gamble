import fs from 'fs';
import path from 'path';
import { calculateBaccaratPayout } from 'src/baccarat/utils/calculateBaccaratPayout';

const allResults: string[] = [];
const MINIMUM_BET = 100;
const FIRST_BANKROLL = 10000;

let numberOfWin = 0;

export const playReachHundredBetsOrZero = () => {
  for (let i = 0; i < 100; i++) {
    let bankRoll = FIRST_BANKROLL;

    const personalResult: number[] = [];

    while (bankRoll > MINIMUM_BET && bankRoll < 2 * FIRST_BANKROLL) {
      const betAmount = 100;
      bankRoll -= betAmount;
      const payout = calculateBaccaratPayout({ betTarget: 'B', betAmount });
      bankRoll += payout;
      personalResult.push(bankRoll);
    }

    if (bankRoll > 2 * FIRST_BANKROLL) {
      numberOfWin++;
    }

    // 重くなるので全員分はデータを出力しない
    if (i < 20) {
      allResults.push(personalResult.join(','));
    }
  }

  const resultsPath = path.resolve('results');

  if (!fs.existsSync(resultsPath)) {
    fs.mkdirSync(resultsPath, { recursive: true });
  }

  const fileName = path.basename(__filename).split('.')[0] ?? '';
  fs.writeFileSync(path.resolve(resultsPath, `${fileName}.csv`), allResults.join('\n'));

  fs.writeFileSync(
    path.resolve(resultsPath, `${fileName}Result.txt`),
    `100人中${numberOfWin}人が勝利した。`,
  );
};
