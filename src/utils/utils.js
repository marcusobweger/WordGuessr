import ja from "../icons/japan.png";
import ko from "../icons/south-korea.png";
import de from "../icons/germany.png";
import it from "../icons/italy.png";
import fr from "../icons/france.png";
import es from "../icons/spain.png";
import en from "../icons/united-states.png";
// function for fetching the random english words
export const fetchRandomWords = async (wordCount) => {
  // two APIs for additional variety and fallback
  const API1 = `https://random-word-api.herokuapp.com/word?number=${wordCount}`;
  const API2 = `https://random-word-api.vercel.app/api?words=${wordCount}`;
  // return a random API from the APIs above
  function getRandomApi() {
    const number = Math.round(Math.random());
    if (number === 0) {
      return API1;
    } else {
      return API2;
    }
  }
  // return the other API
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
    // try to fetch from the random API, abort after 4 seconds
    const response1 = await fetch(currentApi, { signal: AbortSignal.timeout(4000) });
    // return the json data if statuscode is 200
    if (response1.ok) {
      return await response1.json();
    } else {
      throw new Error("Network response was not ok");
    }
  } catch (error) {
    // if an error occurred, try the other API
    try {
      const response2 = await fetch(otherApi, { signal: AbortSignal.timeout(4000) });
      if (response2.ok) {
        return await response2.json();
      } else {
        throw new Error("Network response was not ok");
      }
    } catch (error) {}
  }
};
// function for fetching the translation data
export const fetchTranslation = async (wordsFetched, sourceLang, targetLang) => {
  // build the URL
  const baseUrl = "https://lingva.ml/api/v1";
  const endpoint = `${baseUrl}/${sourceLang}/${targetLang}/${wordsFetched}`;
  try {
    // fetch the data
    const response = await fetch(endpoint);
    // throw and error if the statuscode isn't 200
    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }
    // convert to json
    const data = await response.json();
    // remove spaces and split the data by certain regexes since languages like japanese and korean use different commas
    return data.translation.replace(/\s+/g, "").split(/[、,]/);
  } catch (error) {
    return [];
  }
};
// globals
// values for generating buttons
export const targetLanguages = ["ja", "ko", "de", "it", "fr", "es"];
export const wordCounts = [3, 5, 10, 15];
export const gamemodes = [0, 1, 2];
export const types = ["highScores", "wins"];

// map icon names to corresponding strings for button generation
export const iconMap = {
  ja: ja,
  ko: ko,
  de: de,
  it: it,
  fr: fr,
  es: es,
  en: en,
};
