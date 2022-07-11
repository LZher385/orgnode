import React, { KeyboardEventHandler, useCallback, useRef } from "react";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../app/store";
import { useHotkeys, Options } from "react-hotkeys-hook";
import { NodeItem } from "../../components";
import logging from "../../config/logging";
import { listNodes, addNode, INode, setCurrentId } from "../../features";
import { useLocation, useParams } from "react-router-dom";

type Props = {};

export enum EditStates {
  None,
  Title,
  Desc,
  Schedule,
  Deadline,
}

function NodePage(props: Props) {
  const dispatch = useDispatch();
  const editState = useSelector((state: RootState) => state.global.editState);
  // get id of root node
  const { id } = useParams();
  // TODO create another function to fetch just the node we want
  const nodes = useSelector((state: RootState) => state.nodes.value);
  // get root node
  const rootNode = nodes.find((n) => n._id === id);

  const currentId = useSelector((state: RootState) => state.global.currentId);
  const openedIds = useSelector((state: RootState) => state.global.openedIds);

  useEffect(() => {
    dispatch(setCurrentId({currentId: id!}));
  }, []);

  // Hotkeys
  const hotkeyOptions: Options = {
    filter: (_) => editState !== EditStates.Deadline,
    filterPreventDefault: false,
    keydown: true,
  };

  useHotkeys("j", () => {
  const node = nodes.find((n) => n._id === currentId);
    if (currentId in openedIds && (node?.children?.length ?? -1) > 0) {
      // is open, go to first child
      dispatch(setCurrentId({currentId: node!.children![0]._id}));
    } else if (node?.nextSibId) {
      // has next sibling, go to next sibling
      dispatch(setCurrentId({currentId: node?.nextSibId}));
    } else {
      // go to closest ancestor nextSibling
      const currNodeId = node?.parentId;
      //while (currNodeId) {
      //  currNode = nodes.
      //  if (currNode
      //}
    }
  }, hotkeyOptions);

  useHotkeys("k", () => {}, hotkeyOptions);

  const handleKeyPress = useCallback((event: KeyboardEvent) => {
    console.log(`Key pressed: ${event.key}`);

    // Prevent default behaviours
    if (event.key === "Tab") {
      event.preventDefault();
    }
  }, []);

  useEffect(() => {
    // attach the event listener
    document.addEventListener("keydown", handleKeyPress);

    // remove the event listener
    return () => {
      document.removeEventListener("keydown", handleKeyPress);
    };
  }, [handleKeyPress]);

  return (
    <div className="h-screen max-w-screen-xl mx-auto">
      <header className="py-6 px-4">
        <h1 className="text-doom-green text-5xl underline">{rootNode?.title}</h1>
      </header>
      <div className="mx-5">
        <NodeItem node={rootNode!} />
      </div>
    </div>
  );
}

export default NodePage;
