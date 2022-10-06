import { Request, Response } from "express";
import logging from "../config/logging";
import { Node } from "../models";
import asyncHandler from "express-async-handler";

const create = asyncHandler(async (req: Request, res: Response) => {
  const {
    title,
    description,
    ancestors,
    parent,
    scheduledDate,
    deadlineDate,
    isRoot,
  } = req.body;

  const newNode = await Node.create({
    title,
    description,
    ancestors,
    parent,
    scheduledDate,
    deadlineDate,
    isRoot,
  });
  if (newNode) {
    logging.info("New node created");
    res.status(201).json({
      _id: newNode._id,
      title: newNode.title,
      ancestors: newNode.ancestors,
      parent: newNode.parent,
    });
  } else {
    res.status(400);
    throw new Error("Failed to create node");
  }
});

const get = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const node = await Node.findById(id);

  if (node) {
    logging.info("Read node");
    res.status(200).json({
      _id: node._id,
      title: node.title,
      description: node.description,
      ancestors: node.ancestors,
      parent: node.parent,
      scheduledDate: node.scheduledDate,
      deadlineDate: node.deadlineDate,
      isRoot: node.isRoot,
    });
  } else {
    res.status(400);
    throw new Error("Failed to read node");
  }
});

const getRootNodes = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const nodes = await Node.find({ isRoot: true });

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

const update = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const {
    title,
    description,
    ancestors,
    parent,
    scheduledDate,
    deadlineDate,
    isRoot,
  } = req.body;

  const updatedNode = await Node.findByIdAndUpdate(id, {
    title,
    description,
    ancestors,
    parent,
    scheduledDate,
    deadlineDate,
    isRoot,
  });

  if (updatedNode) {
    logging.info("Updated node");
    res.status(200).json({
      updatedNode,
    });
  } else {
    res.status(400);
    throw new Error("Failed to update node");
  }
});

const deleteNode = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const deletedNode = await Node.findByIdAndDelete(id);

  if (deletedNode) {
    logging.info("Deleted node");
    res.status(200).json({
      deletedNode,
    });
  } else {
    throw new Error("Failed to delete node");
  }
});

export default {
  create,
  get,
  getRootNodes,
  update,
  deleteNode,
};
