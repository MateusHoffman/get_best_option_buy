import { get_price_variation } from "./src/utils/get_price_variation.js";
import {
  calculateBusinessDays,
  calculateStrike,
  getExpectedReturnOperation,
  resultMessageGenerator,
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
  console.log(`CALL - Período de ${businessDays} dias, varia cerca de ${variationMinCall}% pra cima`)
  console.log(`PUT - Período de ${businessDays} dias, varia cerca de ${-variationMinPut}% pra baixo`)

  // Obter o strike mínimo de call e de put
  const { bestStrikeCall, bestStrikePut } = await calculateStrike(
    config.TICKER,
    variationMinCall,
    variationMinPut
  );

  const expectedReturn = getExpectedReturnOperation(
    config.EXPECTED_RETURN_MONTH,
    config.EXPIRATION
  );

  resultMessageGenerator(
    bestStrikeCall,
    expectedReturn,
    config.STRIKE_AVAILABLE_CALL,
    "CALL"
  );
  resultMessageGenerator(
    bestStrikePut,
    expectedReturn,
    config.STRIKE_AVAILABLE_PUT,
    "PUT"
  );
};

const config = {
  TICKER: "CIEL3",
  EXPIRATION: "19/07/2024",
  STRIKE_AVAILABLE_CALL: null,
  STRIKE_AVAILABLE_PUT: null,
};

get_best_option_buy({ ...config, ...fixed });
