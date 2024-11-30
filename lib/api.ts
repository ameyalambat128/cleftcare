import axios from "axios";

const API_BASE_URL = "https://cleftcare-ohm-1067608021780.us-east1.run.app";

export const predictOhmRating = async (
  userId: string,
  name: string,
  promptNumber: number,
  uploadFileName: string
) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/predict`, {
      userId,
      name,
      promptNumber,
      uploadFileName,
    });
    return response.data;
  } catch (error) {
    console.error("Error sending POST request:", error);
    throw error;
  }
};
