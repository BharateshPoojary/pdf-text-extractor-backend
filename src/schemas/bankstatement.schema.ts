import { Schema } from "mongoose";
import { BankStatement, BankStatementDocument } from "../types/schema";
import { TransactionSchema } from "./transaction.schema";

//  Bank Statement Schema
export const BankStatementSchema = new Schema<BankStatement>(
  {
    fileName: {
      type: String,
      required: true,
    },
    bankName: {
      type: String,
      required: true,
    },
    accountHolderName: {
      type: String,
      required: true,
    },
    accountNumber: {
      type: String,
      required: true,
    },
    accountType: {
      type: String,
      required: false,
    },
    currency: {
      type: String,
      required: true,
      default: "INR",
    },
    statementStartDate: {
      type: String,
      required: true,
    },
    statementEndDate: {
      type: String,
      required: true,
    },
    openingBalance: {
      type: Number,
      required: true,
    },
    closingBalance: {
      type: Number,
      required: true,
    },
    transactions: {
      type: [TransactionSchema],
      required: true,
      default: [],
    },
  },
  { _id: false }
);

export const BankStatementDocumentSchema = new Schema<BankStatementDocument>(
  {
    jobId: {
      type: String,
      required: true,
      unique: true,
      index: true, // Index for faster queries
    },
    data: {
      type: [BankStatementSchema],
      required: true,
      default: [],
    },
    status: {
      type: String,
      enum: ["PROCESSING", "COMPLETED", "FAILED"],
      default: "PROCESSING",
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt
  }
);

// Create indexes for better query performance
BankStatementDocumentSchema.index({ jobId: 1 });
BankStatementDocumentSchema.index({ status: 1 });
BankStatementDocumentSchema.index({ createdAt: -1 });
