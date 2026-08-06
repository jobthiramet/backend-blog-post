import "dotenv/config";
import express from "express";
import cors from "cors";
import rootRouter from "./routes/root.mjs";
import healthRouter from "./routes/health.mjs";
import profileRouter from "./routes/profile.mjs";
import dbTestRouter from "./routes/dbTest.mjs";
import postsRouter from "./routes/posts.mjs";
import authRouter from "./routes/auth.mjs";
import protectUser from "./middlewares/protectUser.mjs";
import protectAdmin from "./middlewares/protectAdmin.mjs";

const app = express();
const PORT = process.env.PORT || 4000;

app.use(express.json());

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:5174",
      "http://localhost:3000",
      "https://my-job-react-app.vercel.app",
    ],
  })
);

app.use("/", rootRouter);
app.use("/health", healthRouter);
app.use("/profile", profileRouter);
app.use("/db-test", dbTestRouter);
app.use("/posts", postsRouter);
app.use("/auth", authRouter);

app.get("/protected-route", protectUser, (req, res) => {
  res.json({ message: "This is protected content", user: req.user });
});

app.get("/admin-only", protectAdmin, (req, res) => {
  res.json({ message: "This is admin-only content", admin: req.user });
});

app.use((req, res) => {
  return res.status(404).json({
    message: "Route not found",
  });
});

app.use((error, req, res, next) => {
  console.error("Unhandled error:", error);
  return res.status(500).json({
    message: "Internal server error",
    error: error.message,
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;
