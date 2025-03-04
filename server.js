require('dotenv').config();
const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const path = require("path");
const helmet = require('helmet');
const compression = require('compression');
const cors = require('cors');
const cron = require('node-cron');
const generateSitemap = require('./utils/sitemapGenerator');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

// Create an instance of Express
const app = express();

// Middleware
app.use(helmet()); // Security Headers
app.use(compression()); // Gzip Compression
app.use(cors()); // Enable CORS
app.use(morgan('combined')); // Logging HTTP requests

// Rate Limiting (prevents abuse & improves security)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per window
  message: "Too many requests from this IP, please try again later."
});
app.use(limiter);

// Set the port from environment variables or default to 3000
const PORT = process.env.PORT || 3000;

// Configure EJS as the template engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(expressLayouts);
app.set("layout", "layouts/main");

// Middleware to serve static files from the "public" directory
app.use(express.static(path.join(__dirname, "public")));
app.use('/robots.txt', express.static(path.join(__dirname, 'public', 'robots.txt')));

// Generate sitemap on startup
generateSitemap();

// Schedule sitemap update every 24 hours
cron.schedule('0 0 * * *', () => {
    console.log('⏳ Updating sitemap...');
    generateSitemap();
});

// Serve the sitemap file
app.use('/sitemap.xml', express.static(path.join(__dirname, 'public', 'sitemap.xml')));

// Routes
app.use("/", require("./routes/indexRoutes"));

// Handle 404 errors (Page Not Found)
app.use((req, res) => {
  res.status(404).render("error", {
    title: "404 - Page Not Found",
    status: 404,
    message: "The page you are looking for does not exist.",
  });
});

// Centralized error-handling middleware
app.use((err, req, res, next) => {
  console.error(`[Error]: ${err.message}`); // Log error details
  res.status(err.status || 500).render("error", {
    title: "Server Error",
    status: err.status || 500,
    // message: err.message || "An unexpected error occurred. Please try again later.",
  });
});

// Start the server and listen on the specified port
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
