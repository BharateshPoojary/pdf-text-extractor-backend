import { Router } from "express"
import { handleDocDetection } from "../../controllers/process/textdetect.controller"

const router = Router()

router.post("/",handleDocDetection)
export default router;