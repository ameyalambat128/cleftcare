import { S3Client } from "@aws-sdk/client-s3";

const s3Client = new S3Client({
  region: process.env.EXPO_PUBLIC_AWS_REGION,
  credentials: {
    accessKeyId: process.env.EXPO_PUBLIC_AWS_ACCESS_KEY,
    secretAccessKey: process.env.EXPO_PUBLIC_AWS_SECRET_KEY,
  },
});

export { s3Client };
