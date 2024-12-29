import axios from "axios";

const OHM_API_BASE_URL = "https://cleftcare-ohm-1067608021780.us-east1.run.app";
const API_BASE_URL = "http://localhost:3000";

export const predictOhmRating = async (
  userId: string,
  name: string,
  promptNumber: number,
  uploadFileName: string
) => {
  try {
    const response = await axios.post(`${OHM_API_BASE_URL}/predict`, {
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

export const validateLogin = async (email: string) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/api/auth/login?apiKey=1ddf243a713c55eedad668badabdbc4deb940ba454ef0fd770e4da1baedc0d90`,
      {
        emailId: email,
      }
    );
    return response.data;
  } catch (error: any) {
    console.log(
      "Error validating login:",
      error.response?.data || error.message
    );
    throw error.response?.data || { error: "Network or server error" };
  }
};
