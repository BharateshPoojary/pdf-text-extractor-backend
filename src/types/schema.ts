export interface BankStatement {
  fileName: string;
  bankName: string;
  accountHolderName: string;
  accountNumber: string;
  accountType?: string;
  currency: string;
  statementStartDate: string;
  statementEndDate: string;
  openingBalance: number;
  closingBalance: number;
  transactions: Transaction[];
}

export interface Transaction {
  date: string;
  description: string;
  debitAmount: number | null;
  creditAmount: number | null;
  runningBalance: number;
}
