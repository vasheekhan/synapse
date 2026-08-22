declare global {
  namespace Express {
    interface Request {
      userId?: string;
      user?: {
        id: string;
        displayName: string;
        emails?: Array<{ value: string }>;
        photos?: Array<{ value: string }>;
      };
    }
  }
}



import express from "express";
import passport from "./config/passport";
import authRoutes from "./routes/auth.routes";
import cookieParser from "cookie-parser";
import { errorMiddleware } from "./middlewares/error.middleware";
import workspaceRoutes from "./routes/workspace.routes";
import pageRoutes from "./routes/page.routes";
import cors from "cors";
import uploadRoutes from "./routes/upload.routes";
import aiRoutes from "./routes/ai.routes";

const app = express();

console.log("🚀 APP INITIALIZING...");

const allowedOrigins = [
  "http://localhost:5173",
  "https://notion-clone-1-g9dx.onrender.com",
  "https://synapse-six-tau.vercel.app",
  process.env.FRONTEND_URL || "http://localhost:5173"
];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

app.use(express.json());

app.use(cookieParser());

app.use(passport.initialize());

/**
 * ============================================
 * GLOBAL REQUEST LOGGER
 * ============================================
 */
app.use((req, res, next) => {
  const start = Date.now();

  console.log("\n========================================");
  console.log("🌐 INCOMING REQUEST");
  console.log("➡️ Method:", req.method);
  console.log("➡️ URL:", req.originalUrl);
  console.log("➡️ IP:", req.ip);
  console.log("➡️ Time:", new Date().toISOString());
  console.log("========================================");

  res.on("finish", () => {
    const duration = Date.now() - start;

    console.log("----------------------------------------");
    console.log("✅ RESPONSE SENT");
    console.log("➡️ Method:", req.method);
    console.log("➡️ URL:", req.originalUrl);
    console.log("➡️ Status:", res.statusCode);
    console.log("➡️ Duration:", `${duration}ms`);
    console.log("----------------------------------------\n");
  });

  next();
});

/**
 * ============================================
 * ROOT ROUTE
 * ============================================
 */
app.get("/", (req, res) => {
  console.log("🏠 ROOT ROUTE HIT");

  res.status(200).json({
    success: true,
    message: "Notion Clone API is running",
  });
});

/**
 * ============================================
 * HEALTH ROUTE
 * ============================================
 */
app.get("/health", (req, res) => {
  console.log("❤️ HEALTH ROUTE HIT");

  res.status(200).json({
    success: true,
    message: "Server is running",
  });
});

/**
 * ============================================
 * API ROUTES
 * ============================================
 */
console.log("📦 Registering API routes...");

app.use("/api/auth", authRoutes);

console.log("✅ Auth routes registered");

app.use("/api/workspaces", workspaceRoutes);

console.log("✅ Workspace routes registered");

app.use("/api/ai", aiRoutes);

console.log("✅ AI routes registered");

app.use("/api/pages", pageRoutes);

console.log("✅ Page routes registered");

app.use("/api/upload", uploadRoutes);

console.log("✅ Upload routes registered");

/**
 * ============================================
 * 404 HANDLER
 * ============================================
 */
app.use((req, res) => {
  console.log("\n❌ ROUTE NOT FOUND");
  console.log("➡️ Method:", req.method);
  console.log("➡️ URL:", req.originalUrl);

  res.status(404).json({
    success: false,
    message: `Route Not Found - ${req.originalUrl}`,
  });
});

/**
 * ============================================
 * GLOBAL ERROR HANDLER
 * ============================================
 */
app.use((err: any, req: any, res: any, next: any) => {
  console.error("\n❌❌❌ GLOBAL ERROR ❌❌❌");
  console.error("➡️ Method:", req.method);
  console.error("➡️ URL:", req.originalUrl);
  console.error("➡️ Error:", err);
  console.error("➡️ Message:", err?.message);
  console.error("➡️ Stack:", err?.stack);

  next(err);
});

/**
 * Existing error middleware
 */
app.use(errorMiddleware);

console.log("🚀 APP INITIALIZED SUCCESSFULLY");

export default app;