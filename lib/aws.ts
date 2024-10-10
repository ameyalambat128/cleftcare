import { S3Client } from "@aws-sdk/client-s3";

const s3Client = new S3Client({
  region: "us-east-1",
  credentials: {
    accessKeyId: "AKIAWPTHXQRF4ANZ4GUA", // TODO: Store in a .env file
    secretAccessKey: "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", // TODO: Store in a .env file
  },
});

export { s3Client };
