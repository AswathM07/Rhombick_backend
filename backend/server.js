const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const mongoose = require("mongoose");
const connectDB = require("./config/db");

// Import routes
const customerRoutes = require("./routes/customer.route");
const invoiceRoutes = require("./routes/invoice.route");

const app = express();
dotenv.config();

// Database connection with enhanced error handling
connectDB().catch(err => {
  console.error("❌ Database connection failed:", err.message);
  process.exit(1);
});

// Middleware
app.use(cors());
app.use(express.json());

// Global ID parameter validation
app.param('id', (req, res, next, id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "Invalid ID format" });
  }
  next();
});

// API Routes
app.use("/api/customer", customerRoutes);
app.use("/api/invoices", invoiceRoutes);

// Production configuration
const __dirname1 = path.resolve();
if (process.env.NODE_ENV === "production") {
  // Modified path to correctly locate frontend build in Render environment
  const frontendDistPath = path.join(__dirname1, "frontend", "dist");
  
  // Check if frontend build exists
  if (fs.existsSync(frontendDistPath)) {
    console.log("✅ Found frontend build at:", frontendDistPath);
    app.use(express.static(frontendDistPath));
    
    // SPA fallback route
    app.get("*", (req, res) => {
      res.sendFile(path.join(frontendDistPath, "index.html"));
    });
  } else {
    console.warn("⚠️ Frontend build not found - serving API only");
    console.log("ℹ️ Current directory structure:", fs.readdirSync(__dirname1));
    
    app.get("*", (req, res) => {
      res.status(200).json({
        message: "API is running",
        warning: "Frontend assets not found",
        help: "Ensure frontend is built and placed in frontend/dist directory"
      });
    });
  }
} else {
  // Development route
  app.get("/", (req, res) => {
    res.json({
      status: "API running",
      environment: process.env.NODE_ENV || "development",
      timestamp: new Date().toISOString(),
      frontendPath: path.join(__dirname1, "frontend", "dist")
    });
  });
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("🚨 Error:", err.stack); // Include stack trace in logs
  res.status(500).json({
    error: "Internal Server Error",
    message: process.env.NODE_ENV === "development" ? err.message : "Something went wrong",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack })
  });
});

// Server startup
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`
  🚀 Server started on port ${PORT}
  ⏰ ${new Date().toLocaleString()}
  🌐 Environment: ${process.env.NODE_ENV || "development"}
  📂 Working directory: ${__dirname1}
  `);
});

// Graceful shutdown
process.on("SIGTERM", () => {
  console.log("🛑 Shutting down gracefully...");
  server.close(() => {
    console.log("✅ Server closed");
    process.exit(0);
  });
});