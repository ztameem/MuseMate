// audioUtils.js
export const createAudioBlob = (chunks) => {
  return new Blob(chunks, { type: "audio/webm" });
};
import { createAudioBlob } from "../utils/audioUtils";

// In recorder.onstop()
const blob = createAudioBlob(chunks);
setAudioBlob(blob);
