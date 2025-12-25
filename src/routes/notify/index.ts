import { Router } from "express";
import { getByJobId, handleDocDetection } from "../../controllers/process/textdetect.controller";

const router = Router();

router.post("/", handleDocDetection);
router.get("/:jobId", getByJobId);
export default router;
