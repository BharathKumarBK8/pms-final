const router = require("express").Router();
const { readJson, writeJson } = require("../utils/helper");

router.get("/casesheets", async (req, res) => {
  try {
    const casesheets = await readJson("casesheets.json");
    res.status(200).json(casesheets);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/casesheets/:id", async (req, res) => {
  try {
    const casesheets = await readJson("casesheets.json");
    const casesheet = casesheets.find((c) => c.id === parseInt(req.params.id));
    if (!casesheet) {
      return res.status(404).json({ message: "Casesheet not found" });
    }
    res.status(200).json(casesheet);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/casesheets", async (req, res) => {
  const { formData } = req.body;
  try {
    const casesheets = await readJson("casesheets.json");
    const newCasesheet = {
      id: casesheets.length > 0 ? casesheets[casesheets.length - 1].id + 1 : 1,
      code: `CS-${new Date().getFullYear()}-${String(casesheets.length + 1).padStart(4, "0")}`,
      ...formData,
    };
    casesheets.push(newCasesheet);
    await writeJson("casesheets.json", casesheets);
    res.status(201).json(newCasesheet);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put("/casesheets/:id", async (req, res) => {
  try {
    const casesheets = await readJson("casesheets.json");
    const index = casesheets.findIndex((c) => c.id === parseInt(req.params.id));
    if (index === -1) {
      return res.status(404).json({ message: "Casesheet not found" });
    }
    const updatedCasesheet = { ...casesheets[index], ...req.body };
    casesheets[index] = updatedCasesheet;
    await writeJson("casesheets.json", casesheets);
    res.status(200).json(updatedCasesheet);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete("/casesheets/:id", async (req, res) => {
  try {
    const casesheets = await readJson("casesheets.json");
    const index = casesheets.findIndex((c) => c.id === parseInt(req.params.id));
    if (index === -1) {
      return res.status(404).json({ message: "Casesheet not found" });
    }
    casesheets.splice(index, 1);
    await writeJson("casesheets.json", casesheets);
    res.status(200).json({ message: "Casesheet deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
