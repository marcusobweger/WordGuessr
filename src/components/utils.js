export const fetchRandomWords = async (wordCount) => {
  const API1 = `https://random-word-api.herokuapp.com/word?number=${wordCount}`;
  const API2 = `https://random-word-api.vercel.app/api?words=${wordCount}`;

  function getRandomApi() {
    const number = Math.round(Math.random());
    if (number === 0) {
      return API1;
    } else {
      return API2;
    }
  }
  function getOtherApi() {
    if (currentApi === API1) {
      return API2;
    } else {
      return API1;
    }
  }
  const currentApi = getRandomApi();
  const otherApi = getOtherApi();

  try {
    const response1 = await fetch(currentApi);
    if (response1.ok) {
      return await response1.json();
    } else {
      throw new Error("Network response was not ok");
    }
  } catch (error) {
    console.error("First API failed", error);

    try {
      const response2 = await fetch(otherApi);
      if (response2.ok) {
        return await response2.json();
      } else {
        throw new Error("Network response was not ok");
      }
    } catch (error) {
      console.error("Second API failed", error);
    }
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
