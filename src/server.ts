import app from "./index";
import dotenv from "dotenv";
dotenv.config();
const PORT = process.env.PORT || 8001;
app.listen(PORT, () => console.log(`http://localhost:${PORT}`));
