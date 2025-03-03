import axios from "axios";
import { UserInfo } from "./store";
// import { DEV_ENV, CLEFTCARE_API_KEY } from "@/constants/Data";

const PROD = process.env.EXPO_PUBLIC_DEV_ENV === "production" ? true : false;
const OHM_API_BASE_URL = PROD
  ? "https://cleftcare-ohm-1067608021780.us-east1.run.app"
  : "http://localhost:8080";
const API_BASE_URL = PROD
  ? "https://jkneev16h9.execute-api.us-east-1.amazonaws.com/"
  : "http://localhost:3000";
const CLEFTCARE_API_KEY =
  "1ddf243a713c55eedad668badabdbc4deb940ba454ef0fd770e4da1baedc0d90";

// const OHM_API_BASE_URL = "https://cleftcare-ohm-1067608021780.us-east1.run.app";
// const PROD = DEV_ENV === "production" ? true : false;
// const API_BASE_URL = PROD
//   ? "https://jkneev16h9.execute-api.us-east-1.amazonaws.com/"
//   : "http://localhost:3000";

export const predictOhmRating = async (
  userId: string,
  name: string,
  communityWorkerName: string,
  promptNumber: number,
  language: string,
  uploadFileName: string
) => {
  try {
    const response = await axios.post(`${OHM_API_BASE_URL}/predict`, {
      userId,
      name,
      communityWorkerName,
      promptNumber,
      language,
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
      `${API_BASE_URL}/api/auth/login?apiKey=${CLEFTCARE_API_KEY}`,
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

export const getCommunityWorkerByCommunityWorkerId = async (
  communityWorkerId: string
) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/api/community-workers/${communityWorkerId}?apiKey=${CLEFTCARE_API_KEY}`
    );
    return response.data;
  } catch (error: any) {
    console.error(
      "Error fetching community worker by ID:",
      error.response?.data || error.message
    );
    throw error.response?.data || { error: "Failed to fetch community worker" };
  }
};

export const getRecordsByCommunityWorkerId = async (
  communityWorkerId: string
) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/api/community-workers/${communityWorkerId}/users?apiKey=${CLEFTCARE_API_KEY}`
    );
    return response.data;
  } catch (error: any) {
    console.error(
      "Error fetching records by community worker ID:",
      error.response?.data || error.message
    );
    throw error.response?.data || { error: "Failed to fetch records" };
  }
};

export const getRecordByUserId = async (userId: string) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/api/users/${userId}?apiKey=${CLEFTCARE_API_KEY}`
    );
    return response.data;
  } catch (error: any) {
    console.error(
      "Error fetching record by User ID:",
      error.response?.data || error.message
    );
    throw error.response?.data || { error: "Failed to fetch record" };
  }
};

export const addRecord = async (record: Partial<UserInfo>) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/api/add-user?apiKey=${CLEFTCARE_API_KEY}`,
      record
    );
    return response.data;
  } catch (error: any) {
    console.error("Error adding user:", error.response?.data || error.message);
    throw error.response?.data || { error: "Failed to add user" };
  }
};

export const updateRecord = async (
  userId: string,
  record: Partial<UserInfo>
) => {
  try {
    const response = await axios.patch(
      `${API_BASE_URL}/api/users/${userId}?apiKey=${CLEFTCARE_API_KEY}`,
      record
    );
    return response.data;
  } catch (error: any) {
    console.error(
      "Error updating user:",
      error.response?.data || error.message
    );
    throw error.response?.data || { error: "Failed to update user" };
  }
};

export const createAudioFile = async (
  userId: string,
  prompt: string,
  promptNumber: number,
  fileUrl: string,
  duration?: number,
  ohmScore?: number
) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/api/audio-files?apiKey=${CLEFTCARE_API_KEY}`,
      {
        userId,
        prompt,
        promptNumber,
        fileUrl,
        duration,
        ohmScore,
      }
    );
    return response.data;
  } catch (error: any) {
    console.error(
      "Error creating audio file:",
      error.response?.data || error.message
    );
    throw error.response?.data || { error: "Failed to create audio file" };
  }
};

export const updateAverageOhmScore = async (userId: string) => {
  try {
    const response = await axios.patch(
      `${API_BASE_URL}/api/users/${userId}/average-ohm-score?apiKey=${CLEFTCARE_API_KEY}`
    );
    return response.data;
  } catch (error: any) {
    console.error(
      "Error fetching average OHM score:",
      error.response?.data || error.message
    );
    throw (
      error.response?.data || { error: "Failed to fetch average OHM score" }
    );
  }
};
