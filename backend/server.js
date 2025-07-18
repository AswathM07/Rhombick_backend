const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");
const connectDB = require("./config/db");

// const customerRoutes = require("./routes/customer.route");
// const invoiceRoutes = require("./routes/invoice.route");

const app = express();
dotenv.config();
connectDB();

app.use(cors());
app.use(express.json());

// ✅ Mount API routes for both dev and production
// app.use("/api/customer", customerRoutes);
// app.use("/api/invoices", invoiceRoutes);

// ✅ Serve frontend in production
const __dirname1 = path.resolve();
if (process.env.NODE_ENV === "production") {
  const frontendDistPath = path.join(__dirname1, "frontend", "dist");
  app.use(express.static(frontendDistPath));

  // SPA fallback for React Router
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(frontendDistPath, "index.html"));
  });
} else {
  app.get("/", (req, res) => {
    res.send("API running successfully");
  });
}

// ✅ Global error handler
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err.stack);
  res.status(500).send("Something broke!");
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server started on Port ${port}`);
});
