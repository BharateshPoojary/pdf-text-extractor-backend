import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import apiRoutes from "./routes";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.text({ type: 'text/plain' })); // SNS sometimes sends as text

app.use("/api", apiRoutes);


export default app;
