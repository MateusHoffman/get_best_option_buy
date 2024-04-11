import moment from "moment";

export const formatListPrice = (listPrice) =>
  listPrice
    .sort(
      (a, b) =>
        moment(b.date, "DD/MM/YY HH:mm").valueOf() -
        moment(a.date, "DD/MM/YY HH:mm").valueOf()
    )
    .map(({ price }) => (
      price
    ));

export function getListVariation(array, periodo) {
  // Array que irá conter as variações
  let variations = [];

  array.forEach((price, index) => {
    const initialPrice = price
    const finalPrice = array[index - periodo]
    const variation = ((finalPrice / initialPrice) - 1) * 100
    !isNaN(variation) && variations.push(variation)
  });

  // Retorna o array de variações
  return variations;
}

export function keepMostFrequentElements(array, percentile) {
  // Sort the array
  const sortedArray = array.sort((a, b) => a - b);

  // Calculate the number of elements to remove
  const lowerCount = Math.ceil(array.length * percentile);
  const upperCount = Math.ceil(array.length * percentile);

  // Remove the elements
  const resultArray = sortedArray.slice(lowerCount, array.length - upperCount);

  return resultArray.map(num => parseFloat(num.toFixed(2)));
}

export const messageGenerator = (config, value) => {
  const verb = value >= 0 ? "valoriza" : "desvaloriza";
  const options = value >= 0 ? "CALL" : "PUT";
  const absValue = Math.abs(value);
  console.log(
    `${options} - Em apenas ${
      config.CHANCE_EXERCISED * 100
    }% das vezes o ativo se ${verb} mais do que ${absValue}% no período de ${
      config.PERIOD
    } dias úteis`
  );
};
