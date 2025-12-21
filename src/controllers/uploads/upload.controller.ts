import type { Request, Response } from "express";
import fs from "fs";
import {
  StartDocumentTextDetectionCommand,
  type StartDocumentTextDetectionCommandInput,
} from "@aws-sdk/client-textract";
import {
  PutObjectCommand,
  type PutObjectCommandInput,
} from "@aws-sdk/client-s3";
import { textractClient } from "../../aws/client";
import { s3Client } from "../../aws/client"; // You'll need to export this

export const handleUpload = async (req: Request, res: Response) => {
  console.log("At 5 ");
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const filePath = req.file.path;
    const fileBuffer = fs.readFileSync(filePath);

    const bucketName = process.env.S3_BUCKET_NAME;
    const s3Key = `uploads/${Date.now()}-${req.file.originalname}`;

 
    const s3Params: PutObjectCommandInput = {
      Bucket: bucketName,
      Key: s3Key,
      Body: fileBuffer,
      ContentType: req.file.mimetype,
    };

    const s3Command = new PutObjectCommand(s3Params);
    await s3Client.send(s3Command);
    console.log(`File uploaded to S3: ${s3Key}`);

    const textractParams: StartDocumentTextDetectionCommandInput = {
      DocumentLocation: {
        S3Object: {
          Bucket: bucketName,
          Name: s3Key,
        },
      },
    };

    const textractCommand = new StartDocumentTextDetectionCommand(
      textractParams
    );
    const data = await textractClient.send(textractCommand);
    console.log("Textract job started:", data.JobId);

    // Delete local file after uploading to S3
    fs.unlinkSync(filePath);

    return res.status(200).json({
      message: "File uploaded and processing started",
      jobId: data.JobId,
      s3Key: s3Key,
    });
  } catch (error) {
    return res.status(500).json({
      error: error instanceof Error ? error.message : "Error Occurred",
    });
  }
};
