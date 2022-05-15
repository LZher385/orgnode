import express from "express";
import { List } from "../models";

const router = express.Router();

router.post("/", async (req, res) => {
  const { name } = req.body;

  const list = await List.findOne({ name });

  if (list) {
    return res.json({
      errors: [
        {
          msg: "List of the same name already exists.",
        },
      ],
      data: name,
    });
  }

  const newList = await List.create({
    name,
    children: [],
  });

  res.json({
    errors: [],
    data: {
      list: {
        id: newList._id,
        name: newList.name,
      },
    },
  });
});

router.put("/", async (req, res) => {
  const { name, children } = req.body;

  const list = await List.findOne({ name });

  if (!list) {
    return res.json({
      errors: [
        {
          msg: "List does not exist.",
        },
      ],
      data: name,
    });
  }

  const test = await List.updateOne({ name }, req.body);

  res.json({
    errors: [],
    data: {
      test,
    },
  });
});

export default router;
