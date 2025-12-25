import { ai } from "../clients/ai/client";
import { BankStatementModel } from "../models/bankstatement.model";
import { BankStatement } from "../types/schema";
import { ExtractionTemplate } from "./prompt-template";

export const normalizeWithAI = async (
  rawText: string,
  fileName: string,
  jobId: string
): Promise<BankStatement[]> => {
  const prompt = ExtractionTemplate(rawText, fileName);

  try {
    console.log("Raw Text", rawText);
    const result = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });
    const response = result.text;
    // console.log("Response", response);
    // Remove markdown code blocks if present
    const cleanedResponse = response
      ?.replace(/```json\n?/g, "")
      .replace(/```\n?/g, "")
      .trim();

    const parsed = JSON.parse(cleanedResponse ?? "");

    // Validate structure
    if (!Array.isArray(parsed)) {
      throw new Error("AI response is not an array");
    }
    console.log("parsed", parsed);
    return parsed as BankStatement[];
  } catch (error) {
    await BankStatementModel.findOneAndUpdate({ jobId }, { status: "FAILED" });
    console.error("AI normalization error:", error);
    throw new Error("Failed to normalize bank statement with AI");
  }
};
