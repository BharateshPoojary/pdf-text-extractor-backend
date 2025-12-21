import { Router } from "express";
import { handleUpload } from "../../controllers/uploads/upload.controller";
import multer from "multer";
const upload = multer({ dest: "pdfs/" });

const router = Router();
router.get("/", (_, res) => {
  console.log("I am here ");
   return res.json({
    message: "I am gere ",
  });
});
router.post("/", upload.single("pdf-file"), handleUpload);
export default router;
