import express from "express";
import ParksController from "../controllers/parks.js";

const router = express.Router();

router.get("/", ParksController.getParks);
router.get("/:id", ParksController.getParkById);
router.post("/", ParksController.createPark);
router.put("/:id", ParksController.updatePark);
router.delete("/:id", ParksController.deletePark);

export default router;
//testing
