const express = require("express");
const path = require("path");
const helmet = require("helmet");
const morgan = require("morgan");
const compression = require("compression");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "https://unpkg.com"],
        styleSrc: ["'self'", "'unsafe-inline'", "https://unpkg.com"],
      },
    },
  })
); // Security best practices
app.use(morgan("dev")); // Logging
app.use(compression()); // Gzip compression
app.use(express.static(path.join(__dirname, "public"))); // Static files

// Set Pug as templating engine
app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));

// Routes
app.get("/", (req, res) => {
  res.render("index", { title: "Hello World" });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
