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
import { textractClient } from "../../clients/aws/client";
import { s3Client } from "../../clients/aws/client"; // You'll need to export this
import { BankStatementModel } from "../../models/bankstatement.model";
import dbConnection from "../../utils/dbConnect";

export const handleUploadAndDocExtraction = async (
  req: Request,
  res: Response
) => {
  console.log("At 5 ");
  console.log("Request File", req.file);
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }
    await dbConnection();
    console.log("Database connected");
    const filePath = req.file.path;
    const fileBuffer = fs.readFileSync(filePath);

    const bucketName = process.env.S3_BUCKET_NAME;
    const s3Key = `uploads/${Date.now()}~${req.file.originalname}`;

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
      NotificationChannel: {
        RoleArn: process.env.ROLE_ARN,
        SNSTopicArn: process.env.SNS_TOPIC_ARN,
      },
    };

    const textractCommand = new StartDocumentTextDetectionCommand(
      textractParams
    );
    const data = await textractClient.send(textractCommand);
    console.log("Textract job started:", data.JobId);
    // / Create initial document
    if (data.JobId) {
      console.log("Iam here at one ");
      await BankStatementModel.create({
        jobId: data.JobId,
        data: [],
        status: "PROCESSING",
      });
    } else {
      throw new Error("Failed to get job Id");
    }

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
