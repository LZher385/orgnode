import express from "express";
import { nodeController } from "../controllers";

const router = express.Router();

router.get("/", nodeController.readAll);
router.get("/:id", nodeController.read);
router.post("/create", nodeController.create);
router.patch("/update/:id", nodeController.update);
router.delete("/:id", nodeController.deleteNode);

export default router;
