import { Request, Response } from "express";
import logging from "../config/logging";
import { Node } from "../models";
import asyncHandler from "express-async-handler";

const create = asyncHandler(async (req: Request, res: Response) => {
  const { title, description, children, scheduledDate, deadlineDate, isRoot } =
    req.body;

  const newNode = await Node.create({
    title,
    description,
    children,
    scheduledDate,
    deadlineDate,
    isRoot,
  });
  if (newNode) {
    logging.info("New node created");
    res.status(201).json({
      _id: newNode._id,
      title: newNode.title,
      childrenIds: newNode.childrenIds,
    });
  } else {
    res.status(400);
    throw new Error("Failed to create node");
  }
});

const read = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const node = await Node.findById(id);

  if (node) {
    logging.info("Read node");
    res.status(200).json({
      _id: node._id,
      title: node.title,
      description: node.description,
      childrenIds: node.childrenIds,
      scheduledDate: node.scheduledDate,
      deadlineDate: node.deadlineDate,
      isRoot: node.isRoot,
    });
  } else {
    res.status(400);
    throw new Error("Failed to read node");
  }
});

const readAll = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const nodes = await Node.find();

  if (nodes) {
    logging.info("Read all nodes");
    res.status(200).json({
      nodes,
    });
  } else {
    res.status(400);
    throw new Error("Failed to read all nodes");
  }
});

const update = asyncHandler(async (req: Request, res: Response) => {});
const deleteNode = asyncHandler(async (req: Request, res: Response) => {});

export default {
  create,
  read,
  readAll,
  update,
  deleteNode,
};
