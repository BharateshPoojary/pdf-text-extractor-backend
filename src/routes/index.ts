import { Router } from "express";
import uploadRoute from "./uploads/index"
const router = Router();
console.log("I am boss")
router.use("/uploadfile",uploadRoute);

export default router;