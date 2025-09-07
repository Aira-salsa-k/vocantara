import axios from "axios";


export const translateWordService = async (word: string): Promise<string> => {
  try {
    const response = await axios.post(
      "https://openl-translate.p.rapidapi.com/translate",
      {
        target_lang: "id",
        text: word
      },
      {
        headers: {
          "Content-Type": "application/json", 
          "x-rapidapi-host": "openl-translate.p.rapidapi.com",
          "x-rapidapi-key":"e2d6554dcbmsh5b077ebc955fff8p1e078ejsn0da2f1368466"
        }
      }
    );
    // Ambil hasil terjemahan dari field yang benar
    return response.data.translatedText || "Tidak ditemukan";
  } catch (e) {
    console.error("Translate error:", e);
    return "Terjemahan gagal";
  }
};

export const translateIndoToEngService = async (word: string): Promise<string> => {
  try {
    const response = await axios.post(
      "https://openl-translate.p.rapidapi.com/translate",
      {
        target_lang: "en",
        text: word
      },
      {
        headers: {
          "Content-Type": "application/json",
          "x-rapidapi-host": "openl-translate.p.rapidapi.com",
          "x-rapidapi-key":"e2d6554dcbmsh5b077ebc955fff8p1e078ejsn0da2f1368466"
        }
      }
    );
    return response.data.translatedText || "Tidak ditemukan";
  } catch (e) {
    console.error("Translate error:", e);
    return "Terjemahan gagal";
  }
};