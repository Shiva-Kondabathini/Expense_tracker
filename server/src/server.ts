import dotenv from "dotenv";
import path from "path";

import app from "./app";
import { connectDatabase } from "./config/database";

dotenv.config({ path: path.resolve(__dirname, "../.env") });

const PORT = process.env.PORT || 5000;
connectDatabase();
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
