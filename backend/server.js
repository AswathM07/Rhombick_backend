const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");
const fs = require("fs"); // Added for filesystem checks
const connectDB = require("./config/db");

// Import routes (uncommented)
const customerRoutes = require("./routes/customer.route");
const invoiceRoutes = require("./routes/invoice.route");

const app = express();
dotenv.config();

// Connect to database with error handling
connectDB().catch(err => {
  console.error("Database connection failed:", err);
  process.exit(1);
});

// Middleware
app.use(cors());
app.use(express.json());

// API Routes (uncommented)
app.use("/api/customer", customerRoutes);
app.use("/api/invoices", invoiceRoutes);

// Production configuration
const __dirname1 = path.resolve();
if (process.env.NODE_ENV === "production") {
  const frontendDistPath = path.join(__dirname1, "frontend", "dist");
  
  // Verify frontend build exists
  if (!fs.existsSync(frontendDistPath)) {
    console.error("❌ Frontend build not found at:", frontendDistPath);
    console.log("ℹ️ Make sure to run 'npm run build' in your frontend directory");
    process.exit(1);
  }

  // Serve static files
  app.use(express.static(frontendDistPath));

  // SPA fallback route with error handling
  app.get("*", (req, res, next) => {
    const indexPath = path.resolve(frontendDistPath, "index.html");
    if (!fs.existsSync(indexPath)) {
      return res.status(404).send("Frontend index file not found");
    }
    res.sendFile(indexPath, err => {
      if (err) next(err);
    });
  });
} else {
  // Development route
  app.get("/", (req, res) => {
    res.json({
      message: "API running successfully",
      environment: process.env.NODE_ENV || "development",
      timestamp: new Date().toISOString()
    });
  });
}

// Enhanced error handling
app.use((err, req, res, next) => {
  console.error("🚨 Error:", err.stack);
  res.status(500).json({
    error: "Internal Server Error",
    message: process.env.NODE_ENV === "development" ? err.message : "Something went wrong"
  });
});

// Server startup
const port = process.env.PORT || 5000;
const server = app.listen(port, () => {
  console.log(`
  🚀 Server started on port ${port}
  ⏰ ${new Date().toLocaleString()}
  🌐 Environment: ${process.env.NODE_ENV || "development"}
  📁 Working directory: ${__dirname1}
  `);
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (err) => {
  console.error("⚠️ Unhandled Rejection:", err);
  server.close(() => process.exit(1));
});