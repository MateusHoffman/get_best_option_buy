import axios from "axios";
import moment from "moment";
import { getAllPriceByTicker } from "../models/PriceModel.js";
import { formatListPrice } from "./formatData.js";

// Função para obter feriados nacionais do Brasil
const getNationalHolidays = async () => {
  try {
    // Fazendo uma solicitação GET para a API de feriados
    const { data } = await axios.get(
      "https://brasilapi.com.br/api/feriados/v1/2024"
    );
    return data;
  } catch (error) {
    console.error("Erro ao buscar feriados nacionais:", error);
    return [];
  }
};

// Função para verificar se uma data é um feriado nacional
const isNationalHoliday = (date, holidays) =>
  holidays.some((holiday) => holiday.date === date);

// Função para calcular o número de dias úteis entre a data atual e uma data fornecida
export const calculateBusinessDays = async (providedDate) => {
  try {
    // Obter a lista de feriados
    const holidays = await getNationalHolidays();
    let businessDays = 0;
    let currentDate = moment();
    let futureDate = moment(providedDate, "DD/MM/YYYY");

    // Enquanto a data atual for anterior à data fornecida
    while (currentDate.isBefore(futureDate, "day")) {
      // Verificar se a data atual é um dia útil (segunda a sexta) e não é um feriado
      if (
        currentDate.isoWeekday() <= 5 &&
        !isNationalHoliday(currentDate.format("YYYY-MM-DD"), holidays)
      ) {
        businessDays++;
      }
      // Avançar para o próximo dia
      currentDate.add(1, "day");
    }

    return businessDays + 1;
  } catch (error) {
    console.error("Erro ao calcular dias úteis:", error);
    return null;
  }
};

export const calculateStrike = async (
  TICKER,
  variationMinCall,
  variationMinPut
) => {
  // Obter a lista de preços e formatá-la em uma única etapa
  const allPriceFormatted = formatListPrice(await getAllPriceByTicker(TICKER));

  // Obter o preço atual diretamente do array formatado
  const currentPrice = allPriceFormatted[0];

  // Calcular strikeMinCall e strikeMinPut em uma única linha para cada um
  const strikeMinCall = currentPrice * (1 + variationMinCall / 100);
  const strikeMinPut = currentPrice * (1 + variationMinPut / 100);

  // Retornar o resultado como um objeto
  return { strikeMinCall, strikeMinPut };
};

export function calculateStrikesByAward(numero, type, expectedReturnOperation) {
  // Passo 1: Multiplicar o número pelo retorno esperado e arredondar para cima com 2 casas decimais
  const resultado = Math.ceil(numero * expectedReturnOperation * 100) / 100;

  // Passo 2: Criar um array de 3 números iniciando no resultado do Passo 1, incrementando ou decrementando com base no tipo
  const array = Array.from({ length: 3 }, (_, i) =>
    (resultado + expectedReturnOperation * (type === "CALL" ? i : -i)).toFixed(
      2
    )
  );

  // Passo 3: Gerar um objeto com chaves sendo os elementos do array e valores conforme especificado
  return array.reduce((objeto, elemento, index) => {
    // Calcular o valor para a chave atual
    let valor = `> q ${(elemento / expectedReturnOperation - 1).toFixed(
      2
    )} e <= ${(index === 0
      ? numero
      : elemento / expectedReturnOperation
    ).toFixed(2)}`;
    // Adicionar a chave e o valor ao objeto
    objeto[elemento] = valor;
    return objeto;
  }, {});
}

export function calculateAward(strike, expectedReturn, status) {
  // Calcular o prêmio multiplicando strike por expectedReturn
  const award = strike * expectedReturn;
  const roundedAward = Math.floor(award * 100) / 100;

  const possibleAwards = Array.from(
    { length: 3 },
    (_, i) => roundedAward + i * 0.01
  );

  const result = {};

  for (const [index, award] of possibleAwards.entries()) {
    const lowestStrike = Math.ceil((award / expectedReturn) * 100) / 100;
    const biggestStrike =
      Math.floor(((award + 0.0099999) / expectedReturn) * 100) / 100;

    result[award.toFixed(2)] = `strike >= ${formatNumber(
      lowestStrike.toFixed(2)
    )} && strike <= ${formatNumber(biggestStrike.toFixed(2))}`;
  }
  return result;
}

function formatNumber(number) {
  // Adiciona zero à esquerda se o número tiver apenas uma casa decimal
  return number.length === 4 ? `0${number}` : number;
}

export function getExpectedReturnOperation(
  expectedReturnMonth,
  dateExpiration
) {
  var currentDate = moment();
  var startDate = moment(dateExpiration, "DD/MM/YYYY");
  const returnPerDay = (expectedReturnMonth * 12) / 365;
  const daysDifference = startDate.diff(
    moment(currentDate, "DD/MM/YYYY"),
    "days"
  );
  return (daysDifference + 1) * returnPerDay;
}
