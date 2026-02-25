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

// Treatments - Simplified with query params
const treatmentsPath = path.join(__dirname, "data", "treatments.json");
const getTreatments = () =>
  JSON.parse(fs.readFileSync(treatmentsPath, "utf-8"));
const saveTreatments = (data) =>
  fs.writeFileSync(treatmentsPath, JSON.stringify(data, null, 2));

app.get("/api/treatments", (req, res) => {
  let treatments = getTreatments();
  if (req.query.patientId)
    treatments = treatments.filter((t) => t.patientId == req.query.patientId);
  if (req.query.casesheetId)
    treatments = treatments.filter(
      (t) => t.casesheetId == req.query.casesheetId,
    );
  res.json(treatments);
});

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
    casesheetId: req.body.casesheetId ? parseInt(req.body.casesheetId) : null,
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
    casesheetId: req.body.casesheetId ? parseInt(req.body.casesheetId) : null,
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

// Casesheets - Simplified with query params
const casesheetsPath = path.join(__dirname, "data", "casesheets.json");
const getCasesheets = () =>
  fs.existsSync(casesheetsPath)
    ? JSON.parse(fs.readFileSync(casesheetsPath, "utf-8"))
    : [];
const saveCasesheets = (data) =>
  fs.writeFileSync(casesheetsPath, JSON.stringify(data, null, 2));

app.get("/api/casesheets", (req, res) => {
  let casesheets = getCasesheets();
  if (req.query.patientId)
    casesheets = casesheets.filter((c) => c.patientId == req.query.patientId);
  res.json(casesheets);
});

app.get("/api/casesheets/:id", (req, res) => {
  const casesheets = getCasesheets();
  const casesheet = casesheets.find((c) => c.id === parseInt(req.params.id));
  if (!casesheet) return res.status(404).json({ error: "Not found" });
  res.json(casesheet);
});

app.post("/api/casesheets", (req, res) => {
  const casesheets = getCasesheets();
  const newCasesheet = {
    id: casesheets.length + 1,
    patientId: parseInt(req.body.patientId),
    ...req.body,
  };
  casesheets.push(newCasesheet);
  saveCasesheets(casesheets);
  res.status(201).json(newCasesheet);
});

app.put("/api/casesheets/:id", (req, res) => {
  const casesheets = getCasesheets();
  const index = casesheets.findIndex((c) => c.id === parseInt(req.params.id));
  if (index === -1) return res.status(404).json({ error: "Not found" });
  casesheets[index] = { ...casesheets[index], ...req.body };
  saveCasesheets(casesheets);
  res.json(casesheets[index]);
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

// ==================== BILLINGS ====================
const billingsPath = path.join(__dirname, "data", "billings.json");
const getBillings = () =>
  fs.existsSync(billingsPath)
    ? JSON.parse(fs.readFileSync(billingsPath, "utf-8"))
    : [];
const saveBillings = (data) =>
  fs.writeFileSync(billingsPath, JSON.stringify(data, null, 2));

app.get("/api/billings", (req, res) => {
  let billings = getBillings();

  // Filter by invoiceId
  if (req.query.invoiceId) {
    if (req.query.invoiceId === "null") {
      billings = billings.filter((b) => !b.invoiceId);
    } else {
      billings = billings.filter((b) => b.invoiceId == req.query.invoiceId);
    }
  }

  // Filter by patientId (need to check associated treatment)
  if (req.query.patientId) {
    const treatments = getTreatments();
    const patientTreatmentIds = treatments
      .filter((t) => t.patientId == req.query.patientId)
      .map((t) => t.id);
    billings = billings.filter((b) =>
      patientTreatmentIds.includes(b.treatmentId),
    );
  }

  res.json(billings);
});

app.get("/api/billings/:id", (req, res) => {
  const billings = getBillings();
  const billing = billings.find((b) => b.id == req.params.id);
  if (!billing) return res.status(404).json({ error: "Billing not found" });
  res.json(billing);
});

app.post("/api/billings", (req, res) => {
  const billings = getBillings();
  const newBilling = {
    id: billings.length > 0 ? Math.max(...billings.map((b) => b.id)) + 1 : 1,
    treatmentId: parseInt(req.body.treatmentId),
    invoiceId: req.body.invoiceId ? parseInt(req.body.invoiceId) : undefined,
    totalCost: parseFloat(req.body.totalCost),
    discountAmount: parseFloat(req.body.discountAmount || 0),
    finalAmount: parseFloat(req.body.finalAmount),
    status: req.body.status || "Unpaid",
  };
  billings.push(newBilling);
  saveBillings(billings);
  res.status(201).json(newBilling);
});

app.put("/api/billings/:id", (req, res) => {
  const billings = getBillings();
  const index = billings.findIndex((b) => b.id == req.params.id);
  if (index === -1) return res.status(404).json({ error: "Billing not found" });

  billings[index] = {
    ...billings[index],
    treatmentId: req.body.treatmentId
      ? parseInt(req.body.treatmentId)
      : billings[index].treatmentId,
    invoiceId: req.body.invoiceId
      ? parseInt(req.body.invoiceId)
      : billings[index].invoiceId,
    totalCost: req.body.totalCost
      ? parseFloat(req.body.totalCost)
      : billings[index].totalCost,
    discountAmount:
      req.body.discountAmount !== undefined
        ? parseFloat(req.body.discountAmount)
        : billings[index].discountAmount,
    finalAmount: req.body.finalAmount
      ? parseFloat(req.body.finalAmount)
      : billings[index].finalAmount,
    status: req.body.status || billings[index].status,
  };
  saveBillings(billings);
  res.json(billings[index]);
});

app.delete("/api/billings/:id", (req, res) => {
  const billings = getBillings();
  const index = billings.findIndex((b) => b.id == req.params.id);
  if (index === -1) return res.status(404).json({ error: "Billing not found" });
  billings.splice(index, 1);
  saveBillings(billings);
  res.json({ message: "Billing deleted" });
});

// ==================== INVOICES ====================
const invoicesPath = path.join(__dirname, "data", "invoices.json");
const getInvoices = () =>
  fs.existsSync(invoicesPath)
    ? JSON.parse(fs.readFileSync(invoicesPath, "utf-8"))
    : [];
const saveInvoices = (data) =>
  fs.writeFileSync(invoicesPath, JSON.stringify(data, null, 2));

app.get("/api/invoices", (req, res) => {
  let invoices = getInvoices();

  if (req.query.patientId) {
    invoices = invoices.filter((i) => i.patientId == req.query.patientId);
  }

  res.json(invoices);
});

app.get("/api/invoices/:id", (req, res) => {
  const invoices = getInvoices();
  const invoice = invoices.find((i) => i.id == req.params.id);
  if (!invoice) return res.status(404).json({ error: "Invoice not found" });
  res.json(invoice);
});

app.post("/api/invoices", (req, res) => {
  const invoices = getInvoices();
  const newInvoice = {
    id: invoices.length > 0 ? Math.max(...invoices.map((i) => i.id)) + 1 : 1,
    patientId: parseInt(req.body.patientId),
    totalAmount: parseFloat(req.body.totalAmount),
    discountAmount: parseFloat(req.body.discountAmount || 0),
    finalAmount: parseFloat(req.body.finalAmount),
    status: req.body.status || "Unpaid",
    createdAt: new Date().toISOString(),
  };
  invoices.push(newInvoice);
  saveInvoices(invoices);
  res.status(201).json(newInvoice);
});

app.put("/api/invoices/:id", (req, res) => {
  const invoices = getInvoices();
  const index = invoices.findIndex((i) => i.id == req.params.id);
  if (index === -1) return res.status(404).json({ error: "Invoice not found" });

  invoices[index] = {
    ...invoices[index],
    patientId: req.body.patientId
      ? parseInt(req.body.patientId)
      : invoices[index].patientId,
    totalAmount: req.body.totalAmount
      ? parseFloat(req.body.totalAmount)
      : invoices[index].totalAmount,
    discountAmount:
      req.body.discountAmount !== undefined
        ? parseFloat(req.body.discountAmount)
        : invoices[index].discountAmount,
    finalAmount: req.body.finalAmount
      ? parseFloat(req.body.finalAmount)
      : invoices[index].finalAmount,
    status: req.body.status || invoices[index].status,
  };
  saveInvoices(invoices);
  res.json(invoices[index]);
});

app.delete("/api/invoices/:id", (req, res) => {
  const invoices = getInvoices();
  const index = invoices.findIndex((i) => i.id == req.params.id);
  if (index === -1) return res.status(404).json({ error: "Invoice not found" });
  invoices.splice(index, 1);
  saveInvoices(invoices);
  res.json({ message: "Invoice deleted" });
});

// ==================== PAYMENTS ====================
const paymentsPath = path.join(__dirname, "data", "payments.json");
const getPayments = () =>
  fs.existsSync(paymentsPath)
    ? JSON.parse(fs.readFileSync(paymentsPath, "utf-8"))
    : [];
const savePayments = (data) =>
  fs.writeFileSync(paymentsPath, JSON.stringify(data, null, 2));

app.get("/api/payments", (req, res) => {
  let payments = getPayments();

  if (req.query.invoiceId) {
    payments = payments.filter((p) => p.invoiceId == req.query.invoiceId);
  }

  res.json(payments);
});

app.get("/api/payments/:id", (req, res) => {
  const payments = getPayments();
  const payment = payments.find((p) => p.id == req.params.id);
  if (!payment) return res.status(404).json({ error: "Payment not found" });
  res.json(payment);
});

app.post("/api/payments", (req, res) => {
  const payments = getPayments();
  const newPayment = {
    id: payments.length > 0 ? Math.max(...payments.map((p) => p.id)) + 1 : 1,
    invoiceId: parseInt(req.body.invoiceId),
    amount: parseFloat(req.body.amount),
    paymentMethod: req.body.paymentMethod || "Cash",
    paidOn: req.body.paidOn || new Date().toISOString(),
    receivedById: req.body.receivedById,
    notes: req.body.notes || "",
  };
  payments.push(newPayment);
  savePayments(payments);
  res.status(201).json(newPayment);
});

app.put("/api/payments/:id", (req, res) => {
  const payments = getPayments();
  const index = payments.findIndex((p) => p.id == req.params.id);
  if (index === -1) return res.status(404).json({ error: "Payment not found" });

  payments[index] = {
    ...payments[index],
    invoiceId: req.body.invoiceId
      ? parseInt(req.body.invoiceId)
      : payments[index].invoiceId,
    amount: req.body.amount
      ? parseFloat(req.body.amount)
      : payments[index].amount,
    paymentMethod: req.body.paymentMethod || payments[index].paymentMethod,
    paidOn: req.body.paidOn || payments[index].paidOn,
    receivedById: req.body.receivedById || payments[index].receivedById,
    notes:
      req.body.notes !== undefined ? req.body.notes : payments[index].notes,
  };
  savePayments(payments);
  res.json(payments[index]);
});

app.delete("/api/payments/:id", (req, res) => {
  const payments = getPayments();
  const index = payments.findIndex((p) => p.id == req.params.id);
  if (index === -1) return res.status(404).json({ error: "Payment not found" });
  payments.splice(index, 1);
  savePayments(payments);
  res.json({ message: "Payment deleted" });
});

app.listen(PORT, () => console.log(`Server: http://localhost:${PORT}`));
