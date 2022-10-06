import express from "express";
import { nodeController } from "../controllers";
import { body } from "express-validator";

const router = express.Router();

router.get("/", nodeController.getRootNodes);
router.get("/:id", nodeController.get);
router.post("/create", nodeController.create);
router.patch("/update/:id", nodeController.update);
router.delete("/:id", nodeController.deleteNode);

export default router;
