const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const fs = require("fs");
const path = require("path");
const multer = require("multer");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());

// Patients
const patientsPath = path.join(__dirname, "data", "patients.json");
const getPatients = () => JSON.parse(fs.readFileSync(patientsPath, "utf-8"));
const savePatients = (data) =>
  fs.writeFileSync(patientsPath, JSON.stringify(data, null, 2));

app.get("/api/patients", (req, res) => {
  res.json(getPatients());
});

app.get("/api/patients/:id", (req, res) => {
  const patients = getPatients();
  const patient = patients.find((p) => p.id === parseInt(req.params.id));
  if (!patient) return res.status(404).json({ error: "Not found" });
  res.json(patient);
});

app.post("/api/patients", (req, res) => {
  const patients = getPatients();
  const newPatient = { id: patients.length + 1, ...req.body };
  patients.push(newPatient);
  savePatients(patients);
  res.status(201).json(newPatient);
});

app.put("/api/patients/:id", (req, res) => {
  const patients = getPatients();
  const index = patients.findIndex((p) => p.id === parseInt(req.params.id));
  if (index === -1) return res.status(404).json({ error: "Not found" });
  patients[index] = { ...patients[index], ...req.body };
  savePatients(patients);
  res.json(patients[index]);
});

app.delete("/api/patients/:id", (req, res) => {
  const patients = getPatients();
  const index = patients.findIndex((p) => p.id === parseInt(req.params.id));
  if (index === -1) return res.status(404).json({ error: "Not found" });
  patients.splice(index, 1);
  savePatients(patients);
  res.json({ message: "Deleted" });
});

// Treatments
const treatmentsPath = path.join(__dirname, "data", "treatments.json");
const getTreatments = () =>
  JSON.parse(fs.readFileSync(treatmentsPath, "utf-8"));
const saveTreatments = (data) =>
  fs.writeFileSync(treatmentsPath, JSON.stringify(data, null, 2));

app.get("/api/treatments", (req, res) => {
  res.json(getTreatments());
});

app.get("/api/patients/:id/treatments", (req, res) => {
  const treatments = getTreatments();
  const patientTreatments = treatments.filter(
    (t) => t.patientId == req.params.id // Use == instead of ===
  );
  res.json(patientTreatments);
});

// Casesheets
const casesheetsPath = path.join(__dirname, "data", "casesheets.json");
const getCasesheets = () =>
  fs.existsSync(casesheetsPath)
    ? JSON.parse(fs.readFileSync(casesheetsPath, "utf-8"))
    : [];
const saveCasesheets = (data) =>
  fs.writeFileSync(casesheetsPath, JSON.stringify(data, null, 2));

app.get("/api/patients/:id/casesheets", (req, res) => {
  const casesheets = getCasesheets();
  const patientCasesheets = casesheets.filter(
    (c) => c.patientId === parseInt(req.params.id)
  );
  res.json(patientCasesheets);
});

app.get("/api/patients/:patientId/casesheets/:id", (req, res) => {
  const casesheets = getCasesheets();
  const casesheet = casesheets.find(
    (c) =>
      c.id === parseInt(req.params.id) &&
      c.patientId === parseInt(req.params.patientId)
  );
  if (!casesheet) return res.status(404).json({ error: "Not found" });
  res.json(casesheet);
});

app.post("/api/patients/:patientId/casesheets", (req, res) => {
  const casesheets = getCasesheets();
  const newCasesheet = {
    id: casesheets.length + 1,
    patientId: parseInt(req.params.patientId),
    ...req.body,
  };
  casesheets.push(newCasesheet);
  saveCasesheets(casesheets);
  res.status(201).json(newCasesheet);
});

app.put("/api/patients/:patientId/casesheets/:id", (req, res) => {
  const casesheets = getCasesheets();
  const index = casesheets.findIndex(
    (c) =>
      c.id === parseInt(req.params.id) &&
      c.patientId === parseInt(req.params.patientId)
  );
  if (index === -1) return res.status(404).json({ error: "Not found" });
  casesheets[index] = { ...casesheets[index], ...req.body };
  saveCasesheets(casesheets);
  res.json(casesheets[index]);
});

app.get("/api/patients/:patientId/casesheets/:id/treatments", (req, res) => {
  const casesheets = getCasesheets();
  const casesheet = casesheets.find(
    (c) => c.id == req.params.id && c.patientId == req.params.patientId
  );
  if (!casesheet) return res.status(404).json({ error: "Not found" });
  const treatments = getTreatments();
  const patientTreatments = treatments.filter(
    (t) => t.casesheetId == req.params.id
  );
  res.json(patientTreatments);
});

app.post("/api/patients/:patientId/casesheets/:id/treatments", (req, res) => {
  const treatments = getTreatments();
  const newTreatment = {
    id: treatments.length + 1,
    patientId: parseInt(req.params.patientId),
    casesheetId: parseInt(req.params.id),
    ...req.body,
    cost: parseFloat(req.body.cost),
  };
  treatments.push(newTreatment);
  saveTreatments(treatments);
  res.status(201).json(newTreatment);
});

app.put(
  "/api/patients/:patientId/casesheets/:id/treatments/:treatmentId",
  (req, res) => {
    const treatments = getTreatments();
    const index = treatments.findIndex(
      (t) => t.id === parseInt(req.params.treatmentId)
    );
    if (index === -1) return res.status(404).json({ error: "Not found" });
    treatments[index] = {
      ...treatments[index],
      ...req.body,
      patientId: parseInt(req.params.patientId),
      casesheetId: parseInt(req.params.id),
      cost: parseFloat(req.body.cost),
    };
    saveTreatments(treatments);
    res.json(treatments[index]);
  }
);

app.get("/api/treatments/:id", (req, res) => {
  const treatments = getTreatments();
  const treatment = treatments.find((t) => t.id === parseInt(req.params.id));
  if (!treatment) return res.status(404).json({ error: "Not found" });
  res.json(treatment);
});
app.post("/api/treatments", (req, res) => {
  const treatments = getTreatments();
  const newTreatment = {
    id: treatments.length + 1,
    ...req.body,
    patientId: parseInt(req.body.patientId),
    cost: parseFloat(req.body.cost),
  };
  treatments.push(newTreatment);
  saveTreatments(treatments);
  res.status(201).json(newTreatment);
});

app.put("/api/treatments/:id", (req, res) => {
  const treatments = getTreatments();
  const index = treatments.findIndex((t) => t.id === parseInt(req.params.id));
  if (index === -1) return res.status(404).json({ error: "Not found" });
  treatments[index] = {
    ...treatments[index],
    ...req.body,
    patientId: parseInt(req.body.patientId),
    cost: parseFloat(req.body.cost),
  };
  saveTreatments(treatments);
  res.json(treatments[index]);
});

app.delete("/api/treatments/:id", (req, res) => {
  const treatments = getTreatments();
  const index = treatments.findIndex((t) => t.id === parseInt(req.params.id));
  if (index === -1) return res.status(404).json({ error: "Not found" });
  treatments.splice(index, 1);
  saveTreatments(treatments);
  res.json({ message: "Deleted" });
});

// Media storage setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, "uploads")),
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  },
});
const upload = multer({ storage, limits: { fileSize: 10 * 1024 * 1024 } });

// Create uploads directory
const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir);

// Media metadata storage
const mediaPath = path.join(__dirname, "data", "media.json");
const getMedia = () =>
  fs.existsSync(mediaPath)
    ? JSON.parse(fs.readFileSync(mediaPath, "utf-8"))
    : [];
const saveMedia = (data) =>
  fs.writeFileSync(mediaPath, JSON.stringify(data, null, 2));

// Upload media
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

// Get media with filters
app.get("/api/media", (req, res) => {
  let media = getMedia();
  if (req.query.patientId)
    media = media.filter((m) => m.patientId === parseInt(req.query.patientId));
  if (req.query.treatmentId)
    media = media.filter(
      (m) => m.treatmentId === parseInt(req.query.treatmentId)
    );
  res.json(media);
});

// Serve media file
app.get("/api/media/:filename", (req, res) => {
  res.sendFile(path.join(uploadsDir, req.params.filename));
});

// Delete media
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
