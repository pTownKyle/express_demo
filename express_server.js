const express = require("express");
const path = require("path");
const helmet = require("helmet");
const morgan = require("morgan");
const compression = require("compression");
const browserSync = require("browser-sync");

const app = express();
const PORT = process.env.PORT || 3000;

// Initialize Browsersync (only in development)
if (process.env.NODE_ENV !== "production") {
  const bs = browserSync.create();
  bs.init({
    proxy: `http://localhost:${PORT}`,
    files: ["views/**/*.pug", "public/**/*.*"],
    open: false,
    notify: false,
    port: 3001, // Browsersync runs on a separate port
  });
}

// Middleware
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: [
          "'self'",
          "'unsafe-inline'", // Allows inline scripts
          "'unsafe-eval'", // Allows Alpine.js (if needed)
          "https://unpkg.com",
        ],
        styleSrc: ["'self'", "'unsafe-inline'", "https://unpkg.com"],
      },
    },
  })
);

app.use(morgan("dev"));
app.use(compression());
app.use(express.static(path.join(__dirname, "public")));

// Set Pug as templating engine
app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));

// Routes
app.get("/", (req, res) => {
  res.render("index", { title: "Hello World" });
});

app.get("/about", (req, res) => {
  res.render("about", { title: "About" });
});

app.get("/newmsg", (req, res) => {
  res.send("🔥 New text loaded via HTMX! 🔄");
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
