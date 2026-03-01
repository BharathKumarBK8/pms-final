const router = require("express").Router();
const { readJson, writeJson } = require("../utils/helper");

router.get("/patients", async (req, res) => {
  try {
    const patients = await readJson("patients.json");
    res.status(200).json(patients);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/patients/:id", async (req, res) => {
  try {
    const patients = await readJson("patients.json");
    const patient = patients.find((p) => p.id === parseInt(req.params.id));
    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }
    res.status(200).json(patient);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put("/patients/:id", async (req, res) => {
  try {
    const patients = await readJson("patients.json");
    const index = patients.findIndex((p) => p.id === parseInt(req.params.id));
    if (index === -1) {
      return res.status(404).json({ message: "Patient not found" });
    }
    const updatedPatient = { ...patients[index], ...req.body };
    patients[index] = updatedPatient;
    await writeJson("patients.json", patients);
    res.status(200).json(updatedPatient);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/patients", async (req, res) => {
  try {
    const { autoCreateVisit, ...formData } = req.body;
    const patients = await readJson("patients.json");
    const newPatient = {
      id: patients.length > 0 ? patients[patients.length - 1].id + 1 : 1,
      code: `PAT-${new Date().getFullYear()}-${String(
        patients.length + 1,
      ).padStart(4, "0")}`,
      ...formData,
    };
    patients.push(newPatient);
    await writeJson("patients.json", patients);
    let newVisit = null;
    if (autoCreateVisit) {
      const visits = await readJson("visits.json");
      newVisit = {
        id: visits.length > 0 ? visits[visits.length - 1].id + 1 : 1,
        patientId: newPatient.id,
        arrivedAt: new Date().toISOString(),
        status: "open",
      };
      visits.push(newVisit);
      await writeJson("visits.json", visits);
    }
    res.status(201).json({ patient: newPatient, visit: newVisit });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete("/patients/:id", async (req, res) => {
  try {
    let patients = await readJson("patients.json");
    const index = patients.findIndex((p) => p.id === parseInt(req.params.id));
    if (index === -1) {
      return res.status(404).json({ message: "Patient not found" });
    }
    patients.splice(index, 1);
    await writeJson("patients.json", patients);
    res.status(200).json({ message: "Patient deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
