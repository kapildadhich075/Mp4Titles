//  server/utils/fileUpload.js

import { GoogleAIFileManager, FileState } from "@google/generative-ai/server";
import { configDotenv } from "dotenv";
configDotenv();

export const fileManager = new GoogleAIFileManager(process.env.API_KEY); //create a new GoogleAIFileManager instance

export async function fileUpload(path, videoData) {
  try {
    const uploadResponse = await fileManager.uploadFile(path, {
      //give the path as an argument
      mimeType: videoData.mimetype,
      displayName: videoData.name,
    });
    const name = uploadResponse.file.name;
    let file = await fileManager.getFile(name);
    while (file.state === FileState.PROCESSING) {
      //check the state of the file
      process.stdout.write(".");
      await new Promise((res) => setTimeout(res, 10000)); //check every 10 second
      file = await fileManager.getFile(name);
    }
    if (file.state === FileState.FAILED) {
      throw new Error("Video processing failed");
    }
    return file; // return the file object, containing the upload file information and the uri
  } catch (error) {
    throw error;
  }
}
