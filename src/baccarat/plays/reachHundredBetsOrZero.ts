import fs from 'fs';
import path from 'path';
import { calculateBaccaratPayout } from 'src/baccarat/calculateBaccaratPayout';

const allResult: string[] = [];
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
      allResult.push(personalResult.join(','));
    }
  }

  const fileName = path.basename(__filename);
  const resultsPath = path.resolve('results', fileName);

  if (!fs.existsSync(resultsPath)) {
    fs.mkdirSync(resultsPath, { recursive: true });
  }

  fs.writeFileSync(path.resolve(resultsPath, 'baccarat.csv'), allResult.join('\n'));
  fs.writeFileSync(path.resolve(resultsPath, 'baccaratResult.txt'), numberOfWin.toString());
};
