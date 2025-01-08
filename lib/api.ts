import axios from "axios";
import { UserInfo } from "./store";

const OHM_API_BASE_URL = "https://cleftcare-ohm-1067608021780.us-east1.run.app";
// const API_BASE_URL =
//   process.env.DEV_ENV === "local"
//     ? "http://localhost:3000"
//     : "https://production-url.com";
const PROD = false;
const API_BASE_URL = PROD
  ? "https://jkneev16h9.execute-api.us-east-1.amazonaws.com/"
  : "http://localhost:3000";
const API_KEY =
  "1ddf243a713c55eedad668badabdbc4deb940ba454ef0fd770e4da1baedc0d90";

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

export const testProdApi = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/`);
    return response.data;
  } catch (error: any) {
    console.error("Error testing API:", error.response?.data || error.message);
    throw error.response?.data || { error: "Network or server error" };
  }
};

export const validateLogin = async (email: string) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/api/auth/login?apiKey=${API_KEY}`,
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

export const getRecordByCommunityWorkerId = async (
  communityWorkerId: string
) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/api/users/${communityWorkerId}?apiKey=${API_KEY}`
    );
    return response.data;
  } catch (error: any) {
    console.error(
      "Error fetching record by community worker ID:",
      error.response?.data || error.message
    );
    throw error.response?.data || { error: "Failed to fetch record" };
  }
};

export const addRecord = async (record: Partial<UserInfo>) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/api/add-user?apiKey=${API_KEY}`,
      record
    );
    return response.data;
  } catch (error: any) {
    console.error("Error adding user:", error.response?.data || error.message);
    throw error.response?.data || { error: "Failed to add user" };
  }
};
