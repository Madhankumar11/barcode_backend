
import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";

import partRoutes from "./routes/part.js";
import typeRoutes from "./routes/type.js";
import userRoutes from "./routes/user.js";
import transactionRoutes from "./routes/user.js";

dotenv.config();
connectDB();

const app = express();
app.use(express.json());

app.use("/api/parts", partRoutes);
app.use("/api/types", typeRoutes);
app.use("/api/users", userRoutes);
app.use("/api/transactions", transactionRoutes);

app.listen(process.env.PORT, () =>
  console.log("Server running on port", process.env.PORT)
);
