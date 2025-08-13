import express from "express";
import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import PayOS from "@payos/node";

import authRouter from "./controllers/auth.controller.ts";
import appContentRouter from "./controllers/app.content.controller.ts";
import cookieParser from "cookie-parser";
import paymentRoutes from "./controllers/checkout.controller.ts";

//payos
export const payos = new PayOS(
  process.env.PAYOS_CLIENT_ID as string,
  process.env.PAYOS_API_KEY as string,
  process.env.PAYOS_CHECKSUM_KEY as string
);

const app = express();

const corsOption = {
  origin: ["http://localhost:3000"],
  credentials: true,
};
// CORS phải nằm TRƯỚC các route
app.use(cors(corsOption));
app.use(cookieParser());
app.use(express.json());

// Router
app.use("/api/auth", authRouter);
app.use("/api/content", appContentRouter);
app.use("/api/checkout", paymentRoutes);
const PORT = process.env.PORT;
//run
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
