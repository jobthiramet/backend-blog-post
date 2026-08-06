import { Router } from "express";

const healthRouter = Router();

healthRouter.get("/", (req, res) => {
  try {
    return res.status(200).json({ message: "OK" });
  } catch (error) {
    return res.status(500).json({
      message: "Health check failed",
      error: error.message,
    });
  }
});

export default healthRouter;
