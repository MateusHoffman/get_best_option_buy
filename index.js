import { get_price_variation } from "./src/utils/get_price_variation.js";
import {
  calculateAward,
  calculateBusinessDays,
  calculateStrike,
  getExpectedReturnOperation,
} from "./src/utils/utils.js";

const fixed = {
  CHANCE_EXERCISED: 0.3,
  EXPECTED_RETURN_MONTH: 0.01,
};

const get_best_option_buy = async (config) => {
  // Obter a quantidade de dias úteis até o vencimento da opção
  const businessDays = await calculateBusinessDays(config.EXPIRATION);

  // Obter a variação mínima da call e da put
  const { variationMinCall, variationMinPut } = await get_price_variation(
    config.TICKER,
    businessDays,
    config.CHANCE_EXERCISED
  );

  // Obter o strike mínimo de call e de put
  const { strikeMinCall, strikeMinPut } = await calculateStrike(
    config.TICKER,
    variationMinCall,
    variationMinPut
  );

  const expectedReturn = getExpectedReturnOperation(
    config.EXPECTED_RETURN_MONTH,
    config.EXPIRATION
  );

  const awardCall = calculateAward(strikeMinCall, expectedReturn, "CALL");
  const awardPut = calculateAward(strikeMinPut, expectedReturn, "PUT");
  console.log(`CALL >= ${strikeMinCall.toFixed(2)}`, awardCall);
  console.log(`PUT <= ${strikeMinPut.toFixed(2)}`, awardPut);
};

const config = {
  TICKER: "CIEL3",
  EXPIRATION: "21/06/2024",
};

get_best_option_buy({ ...config, ...fixed });
