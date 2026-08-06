import { Router } from "express";

const rootRouter = Router();

rootRouter.get("/", (req, res) => {
  try {
    return res.status(200).send("Hello TechUp!");
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
});

export default rootRouter;
