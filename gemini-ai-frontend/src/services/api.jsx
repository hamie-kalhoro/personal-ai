import axios from "axios";

// Backend API base URL
const API_URL =
  "https://gemini-ai-production-d106.up.railway.app/api/gemini/ask";

export const fetchChatResponse = async (question) => {
  try {
    const response = await axios.post(API_URL, { question });
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
