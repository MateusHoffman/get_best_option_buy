import { getAllPriceByTicker } from "../../src/models/PriceModel.js"
import { formatListPrice, getListVariation, keepMostFrequentElements, messageGenerator } from "../../src/utils/formatData.js";

export const get_price_variation = async (TICKER, PERIOD, CHANCE_EXERCISED) => {
  // OBTER LISTA DE PREÇOS
  const allPrice = await getAllPriceByTicker(TICKER)
  // FORMATAR LISTA DE PREÇOS
  const allPriceFormatted = formatListPrice(allPrice)
  // GERAR LISTA DE VARIAÇÕES
  const listVariation = getListVariation(allPriceFormatted, PERIOD)
  // DELETADO OS VALORES MENOS FREQUENTES
  const mostFrequentElements = keepMostFrequentElements(listVariation, CHANCE_EXERCISED)
  // OBTER O MAIOR VALOR RETIRANDO O CHANCE_EXERCISED
  const highest = mostFrequentElements[mostFrequentElements.length - 1]
  // messageGenerator(config, highest)
  // OBTER O MENOR VALOR RETIRANDO O CHANCE_EXERCISED
  const lower = mostFrequentElements[0]
  // messageGenerator(config, lower)

  const result = {
    variationMinCall: highest,
    variationMinPut: lower
  }

  return result
}
