import { Router } from "express";
import connectionPool from "../utils/db.mjs";

const dbTestRouter = Router();

dbTestRouter.get("/", async (req, res) => {
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

export default dbTestRouter;
