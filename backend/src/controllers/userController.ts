import { Request, Response } from "express";
import { validationResult } from "express-validator";
import asyncHandler from "express-async-handler";
import bcrypt from "bcryptjs";
import JWT from "jsonwebtoken";
import { User } from "../models";

const registerUser = asyncHandler(async (req: Request, res: Response) => {
  const validationErrors = validationResult(req);

  if (!validationErrors.isEmpty()) {
    const errors = validationErrors.array().map((error) => {
      return {
        msg: error.msg,
      };
    });
    res.status(400);
    throw new Error("Invalid email or password!");
  }

  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user) {
    res.status(400);
    throw new Error("Email already in use.");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await User.create({
    email,
    password: hashedPassword,
  });

  const token = await JWT.sign(
    { email: newUser.email },
    process.env.JWT_SECRET as string,
    {
      expiresIn: 360000,
    }
  );

  if (newUser) {
    res.status(201).json({
      _id: newUser._id,
      email: newUser.email,
      token,
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});

const verifyUser = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    res.status(401);
    throw new Error("User does not exist");
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    res.status(401);
    throw new Error("Invalid credentials");
  }

  const token = await JWT.sign(
    { email: user.email },
    process.env.JWT_SECRET as string,
    {
      expiresIn: 360000,
    }
  );

  res.json({
    _id: user._id,
    email: user.email,
    token,
  });
});

export default { registerUser, verifyUser };
