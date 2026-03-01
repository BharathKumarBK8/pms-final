const router = require("express").Router();
const { readJson, writeJson } = require("../utils/helper");

router.get("/visits", async (req, res) => {
  try {
    const { patientId } = req.query;
    let visits = await readJson("visits.json");
    if (patientId) {
      visits = visits.filter((v) => v.patientId === parseInt(patientId));
    }
    res.status(200).json(visits);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/visits/:id", async (req, res) => {
  try {
    const visits = await readJson("visits.json");
    const visit = visits.find((v) => v.id === parseInt(req.params.id));
    if (!visit) {
      return res.status(404).json({ message: "Visit not found" });
    }
    res.status(200).json(visit);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/visits", async (req, res) => {
  try {
    const { formData } = req.body;
    const visits = await readJson("visits.json");
    const newVisit = {
      id: visits.length > 0 ? visits[visits.length - 1].id + 1 : 1,
      ...formData,
    };
    visits.push(newVisit);
    await writeJson("visits.json", visits);
    res.status(201).json(newVisit);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put("/visits/:id", async (req, res) => {
  try {
    const visits = await readJson("visits.json");
    const index = visits.findIndex((v) => v.id === parseInt(req.params.id));
    if (index === -1) {
      return res.status(404).json({ message: "Visit not found" });
    }
    const updatedVisit = { ...visits[index], ...req.body };
    visits[index] = updatedVisit;
    await writeJson("visits.json", visits);
    res.status(200).json(updatedVisit);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete("/visits/:id", async (req, res) => {
  try {
    const visits = await readJson("visits.json");
    const index = visits.findIndex((v) => v.id === parseInt(req.params.id));
    if (index === -1) {
      return res.status(404).json({ message: "Visit not found" });
    }
    visits.splice(index, 1);
    await writeJson("visits.json", visits);
    res.status(200).json({ message: "Visit deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
