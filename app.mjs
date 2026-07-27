import express from "express";
import cors from "cors";

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
  res.send("Hello TechUp!");
});

app.get("/health", (req, res) => {
  res.status(200).json({ message: "OK" });
});

app.get("/profile", (req, res) => {
  res.status(200).json({
    data: {
      name: "john",
      age: 20,
    },
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;
