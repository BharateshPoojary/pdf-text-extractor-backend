import { Router } from "express";
import uploadRoute from "./uploads/index"
import notifyRoute from "./notify/index" 
const router = Router();
router.use("/uploadfile",uploadRoute);
router.use("/notify",notifyRoute)

export default router;