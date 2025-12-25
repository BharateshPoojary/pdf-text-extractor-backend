import {
  GetDocumentTextDetectionCommand,
  GetDocumentTextDetectionCommandOutput,
} from "@aws-sdk/client-textract";
import { textractClient } from "../clients/aws/client";
import { normalizeWithAI } from "../lib/normalize";
import { BankStatementModel } from "../models/bankstatement.model";

export const getDocText = async (jobId: string, fileName: string) => {
  let allBlocks: any[] = [];
  let nextToken: string | undefined = undefined;
  let pageCount = 0;

  // Keep fetching until there's no NextToken
  do {
    pageCount++;
    console.log(`Fetching page ${pageCount}...`);

    const command = new GetDocumentTextDetectionCommand({
      JobId: jobId,
      MaxResults: 1000,
      NextToken: nextToken,
    });

    const response: GetDocumentTextDetectionCommandOutput =
      await textractClient.send(command);
    if (response.JobStatus === "FAILED") {
      await BankStatementModel.findOneAndUpdate(
        { jobId },
        { status: "FAILED" }
      );
      throw new Error("error detecting text");
    }
    // Collect blocks from this page
    if (response.Blocks) {
      allBlocks.push(...response.Blocks);
    }

    // Get the next token for pagination
    nextToken = response.NextToken;

    console.log(
      `Page ${pageCount}: Got ${
        response.Blocks?.length || 0
      } blocks. NextToken: ${nextToken ? "exists" : "none"}`
    );
  } while (nextToken); // Continue while there's a NextToken

  console.log(
    `Total blocks retrieved: ${allBlocks.length} across ${pageCount} pages`
  );

  // Now extract text from all blocks
  const text = allBlocks
    .filter((block) => block.BlockType === "LINE")
    .map((block) => block.Text)
    .join("\n");

  console.log(`Total text length: ${text.length} characters`);

  const resultantData = await normalizeWithAI(text ?? "", fileName,jobId);

  return resultantData;
};
