import { Request, Response } from "express";
import { getDocText } from "../../utils/getDocText";
import { BankStatementModel } from "../../models/bankstatement.model";
import dbConnection from "../../utils/dbConnect";

const handleDocDetection = async (req: Request, res: Response) => {
  try {
    await dbConnection();
    console.log("Database connected");
    // Parse the body (could be JSON or text)
    let body = req.body;
    if (typeof body === "string") {
      body = JSON.parse(body);
    }

    // console.log("Received SNS message type:", body.Type);

    // Handle subscription confirmation
    if (body.Type === "SubscriptionConfirmation") {
      //   console.log("Confirming subscription...");
      const subscribeURL = body.SubscribeURL;

      // Visit the URL to confirm
      const response = await fetch(subscribeURL);
      const confirmationResponse = await response.text();

      //   console.log("Subscription confirmed!", confirmationResponse);
      return res.status(200).send("Subscription confirmed");
    }

    // Handle notifications
    if (body.Type === "Notification") {
      const message = JSON.parse(body.Message);
      console.log("Textract notification:", message);

      if (message.Status === "SUCCEEDED") {
        res.status(200).send("Message received");

        const fileName = message.DocumentLocation.S3ObjectName.split("~").pop();

        const data = await getDocText(message.JobId, fileName);
        await BankStatementModel.findOneAndUpdate(
          { jobId: message.JobId },
          {
            data,
            status: "COMPLETED",
          },
          { new: true }
        );
      } else if (message.Status === "FAILED") {
        await BankStatementModel.findOneAndUpdate(
          { jobId: message.JobId },
          { status: "FAILED" }
        );
        throw new Error("Error Extracting text from pdf");
      }
      return;
    }
  } catch (error) {
    // Update status to failed
    console.error("Webhook error:", error);
    return res.status(500).send("Error");
  }

  return res.status(200).send("OK");
};

const getByJobId = async (req: Request, res: Response) => {
  try {
    await dbConnection();
    console.log("Database connected");
    const { jobId } = req.params;
    console.log("JobId", jobId);
    if (!jobId) {
      return res.status(400).json({ error: "Please send a jobId" });
    }
    const document = await BankStatementModel.findOne({ jobId });

    if (!document) {
      return res.status(404).json({ error: "Job not found" });
    }

    return res.json({
      jobId: document.jobId,
      status: document.status,
      data: document.data,
    });
  } catch (error) {
    console.error("Error fetching data:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
export { handleDocDetection, getByJobId };
