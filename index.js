import { get_price_variation } from "./src/utils/get_price_variation.js";
import {
  calculateBusinessDays,
  calculateStrike,
  calculateStrikesByAward,
} from "./src/utils/utils.js";

const fixed = {
  CHANCE_EXERCISED: 0.2,
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

  // Obter as melhores operações para garantir a rentabilidade
  const bestStrikesCall = calculateStrikesByAward(
    strikeMinCall,
    "CALL",
    config.EXPECTED_RETURN_MONTH
  );
  const bestStrikesPut = calculateStrikesByAward(
    strikeMinPut,
    "PUT",
    config.EXPECTED_RETURN_MONTH
  );

  // Exibir os melhores strikes para call e put
  console.log(`CALL - ${strikeMinCall.toFixed(2)}`, bestStrikesCall);
  console.log(`PUT - ${strikeMinPut.toFixed(2)}`, bestStrikesPut);
};

const config = {
  TICKER: "CIEL3",
  EXPIRATION: "19/04/2024",
};

get_best_option_buy({ ...config, ...fixed });
