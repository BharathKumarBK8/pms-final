const router = require("express").Router();
const { readJson, writeJson } = require("../utils/helper");
const { route } = require("./auth");

router.get("/treatments", async (req, res) => {
  try {
    const treatments = await readJson("treatments.json");
    res.status(200).json(treatments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/treatments/:id", async (req, res) => {
  try {
    const treatments = await readJson("treatments.json");
    const treatment = treatments.find((t) => t.id === parseInt(req.params.id));
    if (!treatment) {
      return res.status(404).json({ message: "Treatment not found" });
    }
    res.status(200).json(treatment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/treatments", async (req, res) => {
  try {
    const treatments = await readJson("treatments.json");
    const newTreatment = {
      id: treatments.length > 0 ? treatments[treatments.length - 1].id + 1 : 1,
      code: `TRT-${new Date().getFullYear()}-${String(treatments.length + 1).padStart(4, "0")}`,
      ...req.body,
    };
    treatments.push(newTreatment);
    await writeJson("treatments.json", treatments);
    res.status(201).json(newTreatment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put("/treatments/:id", async (req, res) => {
  try {
    const treatments = await readJson("treatments.json");
    const index = treatments.findIndex((t) => t.id === parseInt(req.params.id));
    if (index === -1) {
      return res.status(404).json({ message: "Treatment not found" });
    }
    const updatedTreatment = { ...treatments[index], ...req.body };
    treatments[index] = updatedTreatment;
    await writeJson("treatments.json", treatments);
    res.status(200).json(updatedTreatment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete("/treatments/:id", async (req, res) => {
  try {
    const treatments = await readJson("treatments.json");
    const index = treatments.findIndex((t) => t.id === parseInt(req.params.id));
    if (index === -1) {
      return res.status(404).json({ message: "Treatment not found" });
    }
    treatments.splice(index, 1);
    await writeJson("treatments.json", treatments);
    res.status(200).json({ message: "Treatment deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
