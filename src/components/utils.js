export const fetchRandomWords = async (wordCount) => {
  const API1 = `https://random-word-api.herokuapp.com/word?number=${wordCount}`;
  const API2 = `https://random-word-api.vercel.app/api?words=${wordCount}`;

  function randomApi() {
    const number = Math.round(Math.random());
    if (number === 0) {
      return API1;
    } else {
      return API2;
    }
  }

  try {
    const response = await fetch(randomApi());
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching random words:", error);
    return [];
  }
};
export const fetchTranslation = async (wordsFetched, sourceLang, targetLang) => {
  const baseUrl = "https://lingva.ml/api/v1";
  const endpoint = `${baseUrl}/${sourceLang}/${targetLang}/${wordsFetched}`;
  try {
    const response = await fetch(endpoint);
    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }
    const data = await response.json();
    return data.translation.replace(/\s+/g, "").split(/[、,]/);
  } catch (error) {
    console.error("Error fetching translation:", error);
    return [];
  }
};
