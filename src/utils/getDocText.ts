import { GetDocumentTextDetectionCommand } from "@aws-sdk/client-textract";
import { textractClient } from "../clients/aws/client";
import { normalizeWithAI } from "../lib/normalize";

export const getDocText = async (jobId: string, fileName: string) => {
  //   console.log("Job Id", jobId);
  const result = new GetDocumentTextDetectionCommand({
    JobId: jobId,
  });
  //   console.log("Result", result);
  const response = await textractClient.send(result);
  //   console.log("Response", response);
  const text = response.Blocks?.filter((block) => block.BlockType === "LINE")
    .map((block) => block.Text)
    .join("\n");
  //   console.log("Blocks", text);
  const resultantData = await normalizeWithAI(text ?? "", fileName);
  return resultantData;
};
