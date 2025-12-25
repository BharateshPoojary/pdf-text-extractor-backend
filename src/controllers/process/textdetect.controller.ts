import { Request, Response } from "express";
import { getDocText } from "../../utils/getDocText";

export const handleDocDetection = async (req: Request, res: Response) => {
  try {
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
        // Process the results
        // console.log("Job completed:", message.JobId);
        const fileName = message.DocumentLocation.S3ObjectName.split("~").pop();
        const result = await getDocText(message.JobId, fileName);
        // console.log(result);
        return res.status(200).json({
          success: true,
          data: result,
        });
      }
    }
  } catch (error) {
    console.error("Webhook error:", error);
    res.status(500).send("Error");
  }

  res.status(200).send("OK");
};
