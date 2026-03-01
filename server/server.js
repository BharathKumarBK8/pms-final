const express = require("express");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const passport = require("passport");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const multer = require("multer");
require("dotenv").config();

const JsonSessionStore = require("./utils/JsonSessionStore");
const passportConfig = require("./passport"); // Import passport configuration

const authRoutes = require("./routes/auth");
const patientRoutes = require("./routes/patients");
const casesheetRoutes = require("./routes/casesheets");
const visitRoutes = require("./routes/visits");
const treatmentRoutes = require("./routes/treatments");

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  }),
);
const PORT = 5000;

app.use(
  session({
    store: new JsonSessionStore(),
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 1000 * 60 * 60 * 24,
    },
  }),
);

app.use(passport.initialize());
app.use(passport.session());

// Ensure passport configuration is initialized
passportConfig;

app.use("/auth", authRoutes);
app.use("/api", patientRoutes);
app.use("/api", casesheetRoutes);
app.use("/api", visitRoutes);
app.use("/api", treatmentRoutes);

// Helper function to generate codes with year
const generateCode = (
  prefix,
  existingItems,
  year = new Date().getFullYear(),
) => {
  const yearItems = existingItems.filter((item) =>
    item.code?.startsWith(`${prefix}-${year}`),
  );
  const num = yearItems.length + 1;
  return `${prefix}-${year}-${String(num).padStart(4, "0")}`;
};

// Media storage setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, "uploads")),
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  },
});
const upload = multer({ storage, limits: { fileSize: 10 * 1024 * 1024 } });

const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir);

const mediaPath = path.join(__dirname, "data", "media.json");
const getMedia = () =>
  fs.existsSync(mediaPath)
    ? JSON.parse(fs.readFileSync(mediaPath, "utf-8"))
    : [];
const saveMedia = (data) =>
  fs.writeFileSync(mediaPath, JSON.stringify(data, null, 2));

app.post("/api/media", upload.single("file"), (req, res) => {
  const media = getMedia();
  const newMedia = {
    id: media.length + 1,
    filename: req.file.filename,
    originalName: req.file.originalname,
    path: `/api/media/${req.file.filename}`,
    patientId: req.body.patientId ? parseInt(req.body.patientId) : null,
    treatmentId: req.body.treatmentId ? parseInt(req.body.treatmentId) : null,
    uploadedAt: new Date().toISOString(),
  };
  media.push(newMedia);
  saveMedia(media);
  res.status(201).json(newMedia);
});

app.get("/api/media", (req, res) => {
  let media = getMedia();
  if (req.query.patientId)
    media = media.filter((m) => m.patientId === parseInt(req.query.patientId));
  if (req.query.treatmentId)
    media = media.filter(
      (m) => m.treatmentId === parseInt(req.query.treatmentId),
    );
  res.json(media);
});

app.get("/api/media/:filename", (req, res) => {
  res.sendFile(path.join(uploadsDir, req.params.filename));
});

app.delete("/api/media/:id", (req, res) => {
  const media = getMedia();
  const index = media.findIndex((m) => m.id === parseInt(req.params.id));
  if (index === -1) return res.status(404).json({ error: "Not found" });
  fs.unlinkSync(path.join(uploadsDir, media[index].filename));
  media.splice(index, 1);
  saveMedia(media);
  res.json({ message: "Deleted" });
});

app.listen(PORT, () => console.log(`Server: http://localhost:${PORT}`));
