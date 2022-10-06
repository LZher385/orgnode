import express from "express";
import { body } from "express-validator";
import { userController } from "../controllers";

const router = express.Router();

router.post(
  "/signup",
  body("email").isEmail().withMessage("The email is invalid."),
  body("password").isLength({ min: 5 }).withMessage("The password is invalid."),
  userController.registerUser
);

router.post("/login", userController.verifyUser);

export default router;
