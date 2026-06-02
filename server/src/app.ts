import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes";
import expenseRoutes from "./routes/expense.routes";

const app = express();

app.use(cors());

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/expenses", expenseRoutes);

export default app;
