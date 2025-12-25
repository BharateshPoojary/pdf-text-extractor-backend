import { Router } from "express";
import {  handleUploadAndDocExtraction } from "../../controllers/uploads/upload.controller";
import multer from "multer";

const upload = multer({ dest: "pdfs/" });

const router = Router();
router.get("/", (_, res) => {
   return res.json({
    message: "I am upload File ",
  });
});
router.post("/", upload.single("pdf-file"), handleUploadAndDocExtraction);
export default router;
