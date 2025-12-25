import app from "./index";
import dotenv from "dotenv";
import dbConnection from "./utils/dbConnect";

dotenv.config();

const PORT = process.env.PORT || 8001;

(async () => {
  try {
    await dbConnection();
    
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
})();