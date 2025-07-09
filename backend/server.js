const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
const path = require("path")
const customerRoutes = require("./routes/customer.route");
const invoiceRoutes = require("./routes/invoice.route");
const authRoutes = require("./routes/auth.route");

const app = express();
dotenv.config();
connectDB();

app.use(cors());

app.use(express.json());

//-----deployment
const __dirname1 = path.resolve();

if (process.env.NODE_ENV === "production") {
  const frontendDistPath = path.join(__dirname1, "frontend", "dist");
  app.use(express.static(frontendDistPath));

  app.get("/*any", (req, res) => {
    res.sendFile(path.resolve(frontendDistPath, "index.html"));
  });
} else {
  app.get("/", (req, res) => {
    res.send("API running successfully");
  });
  // Mount authentication routes before protected ones
  app.use('/api/auth', authRoutes);

  app.use("/api/customer",customerRoutes);
  app.use("/api/invoices", invoiceRoutes);
  
}

app.listen(5000, console.log("Server started on Port 5000"));
