# CleftCare API Integration (Expo + Express + FastAPI)

This guide shows how to integrate the speech assessment API with an Expo app using S3 presigned uploads via an Express backend, and ML processing via FastAPI.

## Overview

- Expo uploads each audio attempt directly to S3 using a presigned URL from Express.
- When the user taps Done for a sentence, Express calls FastAPI to run GOP on all attempts, selects the best, and runs OHM on the best file.
- FastAPI returns combined results; Express persists them to a database.
- **OHM and GOP average scores are calculated on the API side** (not in the Expo app). The app consumes pre-computed averages from the API.

## Sentence ID Mapping

The app uses a sequential flow through 17 prompts (1-8 ORAL, 9-16 NASAL, 17 Final). Each sentence has a corresponding `sentenceId`, i18n key, and route file:

| sentenceId | i18n Key                   | Route File       | Type       |
| ---------- | -------------------------- | ---------------- | ---------- |
| 1          | `recordingScreen.prompt1`  | `[promptNumber]` | ORAL       |
| 2          | `recordingScreen.prompt2`  | `[promptNumber]` | ORAL       |
| 3          | `recordingScreen.prompt3`  | `[promptNumber]` | ORAL       |
| 4          | `recordingScreen.prompt4`  | `[promptNumber]` | ORAL       |
| 5          | `recordingScreen.prompt5`  | `[promptNumber]` | ORAL       |
| 6          | `recordingScreen.prompt6`  | `[promptNumber]` | ORAL       |
| 7          | `recordingScreen.prompt7`  | `[promptNumber]` | ORAL       |
| 8          | `recordingScreen.prompt8`  | `[promptNumber]` | ORAL       |
| 9          | `recordingScreen.prompt9`  | `[promptNumber]` | NASAL      |
| 10         | `recordingScreen.prompt10` | `[promptNumber]` | NASAL      |
| 11         | `recordingScreen.prompt11` | `[promptNumber]` | NASAL      |
| 12         | `recordingScreen.prompt12` | `[promptNumber]` | NASAL      |
| 13         | `recordingScreen.prompt13` | `[promptNumber]` | NASAL      |
| 14         | `recordingScreen.prompt14` | `[promptNumber]` | NASAL      |
| 15         | `recordingScreen.prompt15` | `[promptNumber]` | NASAL      |
| 16         | `recordingScreen.prompt16` | `[promptNumber]` | NASAL      |
| 17         | `recordingScreen.prompt17` | `[promptNumber]` | Final      |

### Flow Order

The recording flow proceeds sequentially through prompts 1–17 using the dynamic `[promptNumber]` route, driven by the `SENTENCE_SEQUENCE` array in `lib/sentenceSequence.ts`.

### Transcript Source

Each screen uses `t("recordingScreen.prompt{sentenceId}")` to get the transcript text, which is then passed to `completeSentence()` as the `transcript` parameter. The transcript is language-aware (Kannada/English) based on the current i18n language setting.

### Route Location

All recording screens are located in: `app/(tabs)/(index)/record/[userId]/`

## Endpoints

- Express (Expo app calls)
  - POST `/uploads/presign` → `{ url, key, expiresIn }`
  - POST `/sentences/complete` → triggers ML batch processing
- FastAPI (ML, called from Express)
  - POST `/api/v1/process-sentence` → GOP+OHM for one sentence
  - (Dev) POST `/api/v1/test/gop-ohm` → combined test with WAV upload
- Backend-only responsibilities
  - After FastAPI finishes processing all required sentences, the Express + ML stack updates OHM/GOP averages in the database without any Expo involvement.

## Key rules

- Filenames must be flat (no slashes) with allowed characters `^[a-zA-Z0-9._-]+$` and extension in {`.m4a`, `.wav`, `.mp3`, `.flac`}.
- Suggested key format: `<userId>_<timestamp>_<uuid>.m4a`.
- Always include `X-API-Key` when calling FastAPI (server-side only).
- Do not call FastAPI directly from Expo in production; use Express endpoints.

## Expo: Upload flow

```ts
// 1) Presign
const { url, key } = await fetch(`${API_BASE}/uploads/presign`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ filename, contentType: "audio/mp4", userId }),
}).then((r) => r.json());

// 2) Upload to S3
await FileSystem.uploadAsync(url, localFileUri, {
  httpMethod: "PUT",
  headers: { "Content-Type": "audio/mp4" },
  uploadType: FileSystem.FileSystemUploadType.BINARY_CONTENT,
});

// Save `key` to include in the sentence submission
```

## Expo: Submit sentence for processing

```ts
await fetch(`${API_BASE}/sentences/complete`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    userId,
    name,
    communityWorkerName,
    sentenceId,
    transcript,
    language: "kn",
    attemptKeys,
  }),
});
```

## Express: Presign route (TypeScript)

```ts
import { Router } from "express";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import crypto from "crypto";
const r = Router();
const s3 = new S3Client({ region: process.env.APP_AWS_REGION });
const sanitize = (s: string) => s.replace(/[^a-zA-Z0-9._-]/g, "-");

r.post("/uploads/presign", async (req, res) => {
  const { filename, contentType, userId } = req.body;
  if (!filename || !contentType || !userId)
    return res.status(400).json({ error: "Bad request" });
  const safeName = sanitize(filename);
  const ext = safeName.includes(".") ? safeName.split(".").pop() : "m4a";
  const key = `${sanitize(userId)}_${Date.now()}_${crypto.randomUUID()}.${ext}`;
  const url = await getSignedUrl(
    s3,
    new PutObjectCommand({
      Bucket: process.env.S3_BUCKET!,
      Key: key,
      ContentType: contentType,
    }),
    { expiresIn: 300 }
  );
  res.json({ url, key, expiresIn: 300 });
});

export default r;
```

## Express: Sentence completion route

```ts
r.post("/sentences/complete", async (req, res) => {
  const {
    userId,
    name,
    communityWorkerName,
    sentenceId,
    transcript,
    language,
    attemptKeys,
  } = req.body;
  if (
    !userId ||
    !sentenceId ||
    !transcript ||
    !Array.isArray(attemptKeys) ||
    attemptKeys.length === 0
  ) {
    return res.status(400).json({ error: "Missing fields" });
  }
  // Optional: persist attempts in your DB
  const fastapiRes = await fetch(
    `${process.env.CLEFTCARE_OHM_URL}/api/v1/process-sentence`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-Key": process.env.CLEFTCARE_OHM_API_KEY!,
      },
      body: JSON.stringify({
        userId,
        name,
        communityWorkerName,
        sentenceId,
        transcript,
        language,
        uploadFileNames: attemptKeys,
        sendEmail: false,
      }),
    }
  );
  const data = await fastapiRes.json();
  res.status(fastapiRes.status).json(data);
});
```

## Expo: App specifics

### Envs (Expo app)

- `API_BASE`: base URL of your Express backend (e.g., `https://api.example.com`)
- Do not call FastAPI directly in production from Expo

### Types

```ts
export type PresignResponse = { url: string; key: string; expiresIn: number };

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

```

### Helpers (Expo)

```ts
const jsonFetch = async <T>(url: string, init?: RequestInit) => {
  const res = await fetch(url, init);
  const body = await res.json().catch(() => ({}));
  if (!res.ok)
    throw Object.assign(new Error("HTTP " + res.status), {
      status: res.status,
      body,
    });
  return body as T;
};

export const presignAttempt = async (
  apiBase: string,
  filename: string,
  contentType: string,
  userId: string
) => {
  return jsonFetch<PresignResponse>(`${apiBase}/uploads/presign`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ filename, contentType, userId }),
  });
};

export const uploadAttemptToS3 = async (
  signedUrl: string,
  localFileUri: string,
  contentType: string
) => {
  // expo-file-system
  const { default: FileSystem } = await import("expo-file-system");
  const result = await FileSystem.uploadAsync(signedUrl, localFileUri, {
    httpMethod: "PUT",
    headers: { "Content-Type": contentType },
    uploadType: FileSystem.FileSystemUploadType.BINARY_CONTENT,
  });
  if (result.status !== 200 && result.status !== 204) {
    throw new Error(`S3 upload failed: ${result.status}`);
  }
};

export const completeSentence = async (
  apiBase: string,
  req: SentenceCompleteRequest
) => {
  return jsonFetch<BatchResult>(`${apiBase}/sentences/complete`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(req),
  });
};
```

### Example usage (screen logic)

```ts
// Pseudocode: per sentence flow
const attemptKeys: string[] = [];

async function onRecordAttemptDone(localUri: string) {
  const filename = "attempt.m4a"; // name for presign; server will return a flat key
  const contentType = "audio/mp4";
  const { url, key } = await presignAttempt(
    API_BASE,
    filename,
    contentType,
    userId
  );
  await uploadAttemptToS3(url, localUri, contentType);
  attemptKeys.push(key);
}

async function onSentenceDone() {
  if (attemptKeys.length === 0) return;
  const result = await completeSentence(API_BASE, {
    userId,
    name,
    communityWorkerName,
    sentenceId,
    transcript,
    language: "kn",
    attemptKeys,
  });
  // result.data.bestFile, result.data.ohmRating, etc.
}
```

### Dev test (optional)

- For ad hoc testing against FastAPI directly (not production flow):
  - `POST /api/v1/test/gop-ohm` (multipart/form-data) with WAV + `transcript` + `language`
  - Header: `X-API-Key`

### Constraints & tips

- Keys returned by presign are flat strings (no `/`), ASCII `[a-zA-Z0-9._-]`, extensions in {`.m4a`, `.wav`, `.mp3`, `.flac`}
- Keep `Content-Type` consistent between presign request and S3 PUT
- Backoff on network errors and 5xx; re-presign if you hit 403/SignatureDoesNotMatch

## FastAPI: Expected request body

```ts
type BatchProcessRequest = {
  userId: string;
  name: string;
  communityWorkerName: string;
  sentenceId: number;
  transcript: string;
  language: "kn" | "en";
  uploadFileNames: string[];
  sendEmail: boolean;
};
```

## S3 CORS example

```json
[
  {
    "AllowedHeaders": ["*"],
    "AllowedMethods": ["PUT", "GET", "HEAD"],
    "AllowedOrigins": [
      "https://your-app.example.com",
      "http://localhost:19006"
    ],
    "ExposeHeaders": ["ETag"],
    "MaxAgeSeconds": 3000
  }
]
```

## IAM policy example (Express principal)

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": ["s3:PutObject"],
      "Resource": "arn:aws:s3:::YOUR_BUCKET/*"
    }
  ]
}
```

## OHM/GOP Average Score Calculation

**Important**: The Expo app does **not** trigger or consume OHM/GOP averages. Once recordings are uploaded and each sentence is submitted, the Express + FastAPI stack:

1. Stores per-sentence OHM/GOP scores (via `/sentences/complete`).
2. Detects when all required sentences are finished for a user.
3. Computes and persists the average OHM and GOP scores directly in the database.

From the mobile perspective there is no additional API to call—just keep uploading attempts and calling `completeSentence`. Any dashboards or backend tooling that needs the averages should read them directly from the backend data store.

## Troubleshooting

- 403 on PUT: wrong Content-Type header or URL expired; re-presign.
- 415/400 at FastAPI: ensure filenames are flat and extensions allowed.
- 429 at FastAPI: backoff and retry; avoid concurrent batch calls.
- Missing average scores: verify the backend job processed all sentences and check server logs.
