import axios from "axios";

// Use a relative path so Vite dev proxy can forward to backend
const API_URL = "/api/gemini/ask";

export const fetchChatResponse = async (question) => {
  try {
    const response = await axios.post(API_URL, { question });
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
