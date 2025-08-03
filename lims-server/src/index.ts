import express from "express";

const app = express();
const PORT = 8000;

// Middleware
app.use(express.json());

// Sample route
app.get("/", (req, res) => {
  res.send("🔬 LIMS Server is running on port 8000");
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server is listening at http://localhost:${PORT}`);
});
