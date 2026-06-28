import express from "express";
import ParksController from "../controllers/parks.js";

const router = express.Router();

console.log("ParksController object looks like:", ParksController);

router.get("/", ParksController.getParks);

router.get("/:parkId", ParksController.getParkById);

router.post("/", ParksController.createPark);

router.patch("/:id", ParksController.updatePark);

router.delete("/:id", ParksController.deletePark);

export default router;
