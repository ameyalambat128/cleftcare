import axios from "axios";
import * as FileSystem from "expo-file-system";
import { UserInfo } from "./store";
// import { DEV_ENV, CLEFTCARE_API_KEY } from "@/constants/Data";

const PROD = process.env.EXPO_PUBLIC_DEV_ENV === "production" ? true : false;

// Express backend configuration (single source of truth)
const EXPRESS_API_BASE =
  process.env.EXPO_PUBLIC_API_BASE ||
  (PROD
    ? "https://jkneev16h9.execute-api.us-east-1.amazonaws.com/api"
    : "http://localhost:3000/api");
const EXPRESS_API_KEY = process.env.EXPO_PUBLIC_EXPRESS_API_KEY || "";

// ============================================================================
// TypeScript Types for CleftCare API Integration
// ============================================================================

export type PresignResponse = {
  url: string;
  key: string;
  expiresIn: number;
};

export type SentenceCompleteRequest = {
  userId: string;
  name: string;
  communityWorkerName: string;
  sentenceId: number;
  transcript: string;
  language: "kn" | "en";
  attemptKeys: string[];
};

export type BatchResult = {
  success: boolean;
  data: {
    sentenceId: number;
    transcript: string;
    totalFiles: number;
    gopResults: Array<{
      filename: string;
      sentence_gop?: number;
      error?: string;
      perphone_gop?: any[];
      latency_ms?: number;
    }>;
    bestFile: { filename: string; gopScore: number };
    ohmRating: number | null;
    errors?: { ohm_error?: string } | null;
  };
  metadata: {
    requestId: string;
    processingTime: number;
    timestamp: number;
    error: string | null;
  };
};

// Removed: direct FastAPI calls in favor of Express batch processing

export const testProdApi = async () => {
  try {
    const response = await axios.get(`${EXPRESS_API_BASE}/`, {
      headers: { "X-API-Key": EXPRESS_API_KEY },
    });
    return response.data;
  } catch (error: any) {
    console.error("Error testing API:", error.response?.data || error.message);
    throw error.response?.data || { error: "Network or server error" };
  }
};

export const validateLogin = async (email: string) => {
  try {
    const response = await axios.post(
      `${EXPRESS_API_BASE}/auth/login`,
      { emailId: email },
      { headers: { "X-API-Key": EXPRESS_API_KEY } }
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
      `${EXPRESS_API_BASE}/community-workers/${communityWorkerId}`,
      { headers: { "X-API-Key": EXPRESS_API_KEY } }
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
      `${EXPRESS_API_BASE}/community-workers/${communityWorkerId}/users`,
      { headers: { "X-API-Key": EXPRESS_API_KEY } }
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
    const response = await axios.get(`${EXPRESS_API_BASE}/users/${userId}`, {
      headers: { "X-API-Key": EXPRESS_API_KEY },
    });
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
    const response = await axios.post(`${EXPRESS_API_BASE}/add-user`, record, {
      headers: { "X-API-Key": EXPRESS_API_KEY },
    });
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
      `${EXPRESS_API_BASE}/users/${userId}`,
      record,
      { headers: { "X-API-Key": EXPRESS_API_KEY } }
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
  ohmScore?: number,
  gopScore?: number
) => {
  try {
    const response = await axios.post(
      `${EXPRESS_API_BASE}/audio-files`,
      {
        userId,
        prompt,
        promptNumber,
        fileUrl,
        duration,
        ohmScore,
        gopScore,
      },
      { headers: { "X-API-Key": EXPRESS_API_KEY } }
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
      `${EXPRESS_API_BASE}/users/${userId}/average-ohm-score`,
      {},
      { headers: { "X-API-Key": EXPRESS_API_KEY } }
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

export const updateAverageGopScore = async (userId: string) => {
  try {
    const response = await axios.patch(
      `${EXPRESS_API_BASE}/users/${userId}/average-gop-score`,
      {},
      { headers: { "X-API-Key": EXPRESS_API_KEY } }
    );
    return response.data;
  } catch (error: any) {
    console.error(
      "Error fetching average GOP score:",
      error.response?.data || error.message
    );
    throw (
      error.response?.data || { error: "Failed to fetch average GOP score" }
    );
  }
};

// ============================================================================
// New API Functions for Presigned Upload Flow
// ============================================================================

/**
 * Helper function for JSON fetch with error handling
 */
const jsonFetch = async <T>(url: string, init?: RequestInit): Promise<T> => {
  const res = await fetch(url, init);
  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw Object.assign(new Error("HTTP " + res.status), {
      status: res.status,
      body,
    });
  }
  return body as T;
};

/**
 * Request a presigned URL from Express backend for uploading an audio attempt
 * @param filename - Name of the file (e.g., "attempt.m4a")
 * @param contentType - MIME type (e.g., "audio/m4a")
 * @param userId - User ID for the recording
 * @returns Promise with presigned URL, key, and expiration time
 */
export const presignAttemptUpload = async (
  filename: string,
  contentType: string,
  userId: string
): Promise<PresignResponse> => {
  try {
    return await jsonFetch<PresignResponse>(
      `${EXPRESS_API_BASE}/uploads/presign`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-API-Key": EXPRESS_API_KEY,
        },
        body: JSON.stringify({ filename, contentType, userId }),
      }
    );
  } catch (error: any) {
    console.error("Error requesting presigned URL:", error);
    throw error;
  }
};

/**
 * Upload an audio file to S3 using a presigned URL
 * @param signedUrl - The presigned URL from Express
 * @param localFileUri - Local file path of the recording
 * @param contentType - MIME type (must match presign request)
 */
export const uploadAttemptToS3 = async (
  signedUrl: string,
  localFileUri: string,
  contentType: string
): Promise<void> => {
  try {
    const result = await FileSystem.uploadAsync(signedUrl, localFileUri, {
      httpMethod: "PUT",
      headers: { "Content-Type": contentType },
      uploadType: FileSystem.FileSystemUploadType.BINARY_CONTENT,
    });

    if (result.status !== 200 && result.status !== 204) {
      throw new Error(`S3 upload failed with status: ${result.status}`);
    }

    console.log("Successfully uploaded to S3");
  } catch (error: any) {
    console.error("Error uploading to S3:", error);
    throw error;
  }
};

/**
 * Submit all recording attempts for a sentence to Express for batch GOP+OHM processing
 * @param request - Sentence completion request with all attempt keys
 * @returns Promise with batch processing results including best file and OHM rating
 */
export const completeSentence = async (
  request: SentenceCompleteRequest
): Promise<BatchResult> => {
  try {
    return await jsonFetch<BatchResult>(
      `${EXPRESS_API_BASE}/sentences/complete`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-API-Key": EXPRESS_API_KEY,
        },
        body: JSON.stringify(request),
      }
    );
  } catch (error: any) {
    console.error("Error completing sentence:", error);
    throw error;
  }
};
