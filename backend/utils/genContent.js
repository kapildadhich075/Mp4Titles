// server/utils/genContent.js

import model from "../gemini/gemini.config.js";
import { configDotenv } from "dotenv";
configDotenv();

export async function getContent(file) {
  try {
    const result = await model.generateContent([
      {
        fileData: {
          mimeType: file.mimeType,
          fileUri: file.uri,
        },
      },
      {
        text: "You need to write a subtitle for this full video, write the subtitle in the SRT format, don't write anything else other than a subtitle in the response, create accurate subtitle.",
      },
    ]);
    return result.response.text();
  } catch (error) {
    throw error;
  }
}
