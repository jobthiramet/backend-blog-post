import "dotenv/config";
import express from "express";
import cors from "cors";
import connectionPool from "./utils/db.mjs";
import postsRouter from "./routes/posts.mjs";

const app = express();
const PORT = process.env.PORT || 4000;

app.use(express.json());

// CORS — after creating app, before routes
app.use(
  cors({
    origin: [
      "http://localhost:5173", // Frontend local (Vite)
      "http://localhost:5174", // Frontend local (Vite alternate port)
      "http://localhost:3000", // Frontend local (React อื่น)
      "https://my-job-react-app.vercel.app", // Frontend ที่ Deploy แล้ว
    ],
  })
);

app.get("/", (req, res) => {
  try {
    return res.status(200).send("Hello TechUp!");
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
});

app.get("/health", (req, res) => {
  try {
    return res.status(200).json({ message: "OK" });
  } catch (error) {
    return res.status(500).json({
      message: "Health check failed",
      error: error.message,
    });
  }
});

app.get("/profile", (req, res) => {
  try {
    return res.status(200).json({
      data: {
        name: "john",
        age: 20,
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to get profile",
      error: error.message,
    });
  }
});

app.get("/db-test", async (req, res) => {
  try {
    const result = await connectionPool.query("SELECT NOW() AS current_time");
    return res.status(200).json({
      message: "Database connection successful",
      data: result.rows[0],
    });
  } catch (error) {
    console.error("Database connection error:", error.message);
    return res.status(500).json({
      message: "Database connection failed",
      error: error.message,
    });
  }
});

app.use("/posts", postsRouter);

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
