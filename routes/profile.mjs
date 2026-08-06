import { Router } from "express";

const profileRouter = Router();

profileRouter.get("/", (req, res) => {
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

export default profileRouter;
