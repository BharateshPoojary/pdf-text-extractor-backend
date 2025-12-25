import mongoose from "mongoose";
import { BankStatementDocument } from "../types/schema";
import { BankStatementDocumentSchema } from "../schemas/bankstatement.schema";

export const BankStatementModel = mongoose.model<BankStatementDocument>(
  "BankStatement",
  BankStatementDocumentSchema
);
