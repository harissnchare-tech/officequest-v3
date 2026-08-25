require("dotenv").config();

const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const path = require("path");

const authRoutes = require("./routes/authRoutes");
const questRoutes = require("./routes/questRoutes");
const userRoutes = require("./routes/userRoutes");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");

const app = express();

// ---------- Middlewares globaux ----------
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}

// ---------- Fichiers statiques ----------
app.use(express.static(path.join(__dirname, "..", "public")));
app.use("/uploads", express.static(path.join(__dirname, "..", "uploads")));

// ---------- Route de santé (utile pour Render) ----------
app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "HARISS OfficeQuest V3 API opérationnelle.",
    timestamp: new Date().toISOString(),
  });
});

// ---------- Routes API ----------
app.use("/api/auth", authRoutes);
app.use("/api/quests", questRoutes);
app.use("/api/users", userRoutes);

// ---------- Fallback SPA : sert index.html pour les routes non-API ----------
app.get("*", (req, res, next) => {
  if (req.originalUrl.startsWith("/api")) return next();
  res.sendFile(path.join(__dirname, "..", "public", "index.html"));
});

// ---------- Gestion des erreurs ----------
app.use(notFound);
app.use(errorHandler);

// ---------- Démarrage du serveur ----------
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("========================================");
  console.log("  HARISS OfficeQuest V3");
  console.log(`  Serveur démarré sur le port ${PORT}`);
  console.log(`  Environnement : ${process.env.NODE_ENV || "development"}`);
  console.log("========================================");
});

module.exports = app;
