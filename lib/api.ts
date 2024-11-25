import axios from "axios";

const API_BASE_URL = "http://localhost:8000";

export const predictOhmRating = async (
  userId: string,
  uploadFileName: string
) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/predict`, {
      userId,
      uploadFileName,
    });
    return response.data;
  } catch (error) {
    console.error("Error sending POST request:", error);
    throw error;
  }
};
