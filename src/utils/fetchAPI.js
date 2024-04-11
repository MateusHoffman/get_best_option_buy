export const fetchAPI = async (url, requestOptions) => {
  let retryCount = 0;

  while (retryCount < 5) {
    try {
      const response = await fetch(url, requestOptions);

      if (response.ok) {
        const data = await response.json();
        return data;
      } else if (response.status === 429) {
        const waitTime = Math.pow(2, retryCount) * 1000;
        await new Promise(resolve => setTimeout(resolve, waitTime));
        retryCount++;
      } else if (response.status >= 500 && response.status <= 599) {
        retryCount++;
        console.debug(`${retryCount}º Tentativa - Falha na solicitação! Status: ${response.status}`);
      } else {
        console.log('Falha na solicitação! Status:', response.status);
        break;
      }
    } catch (error) {
      console.log('Error fetchAPI:', error);
      break;
    }
  }

  return null;
};