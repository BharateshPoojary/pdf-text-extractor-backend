import { Schema } from "mongoose";
import { Transaction } from "../types/schema";

// Transaction Schema
export const TransactionSchema = new Schema<Transaction>({
  date: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  debitAmount: {
    type: Number,
    default: null
  },
  creditAmount: {
    type: Number,
    default: null
  },
  runningBalance: {
    type: Number,
    required: true
  }
}, { _id: false }); // _id: false prevents creating _id for subdocuments
