import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import compression from "compression";

const app = express();
const PORT = process.env.PORT || 3000;

// Basic security headers
app.use(helmet({
  contentSecurityPolicy: {
    useDefaults: true,
    directives: {
      "script-src": ["'self'"],
      "style-src": ["'self'", "'unsafe-inline'"]
    }
  }
}));

app.use(compression());
app.use(morgan("tiny"));
app.use(express.static("public", { extensions: ["html"] }));

// Health check
app.get("/healthz", (req, res) => res.json({ status: "ok" }));

// Fallback to index.html for root
app.get("/", (req, res) => {
  res.sendFile(new URL("./public/index.html", import.meta.url).pathname);
});

app.listen(PORT, () => {
  console.log(`Calculator app listening on port ${PORT}`);
});
