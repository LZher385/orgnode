import React, { KeyboardEventHandler, useCallback, useRef } from "react";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../app/store";
import { useHotkeys, Options } from "react-hotkeys-hook";
import { NodeItem } from "../../components";
import logging from "../../config/logging";
import { listNodes, addNode, INode } from "../../features";
import { useLocation, useParams } from "react-router-dom";

type Props = {
};

export enum EditStates {
  None,
  Title,
  Desc,
  Schedule,
  Deadline,
}

function NodePage(props: Props) {
  const dispatch = useDispatch();
  const { id } = useParams();
  const nodes = useSelector((state: RootState) => state.nodes.value);
  const node = nodes.find(n => n._id === id);
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [editState, setEditState] = useState<EditStates>(EditStates.None);

  // Hotkeys
  // const hotkeyOptions: Options = {
  //   filter: (_) =>
  //     editState !== EditStates.Deadline,
  //   filterPreventDefault: false,
  //   keydown: true,
  // };

  // useHotkeys(
  //   "j",
  //   () => {
  //     setSelectedIndex((prevState) =>
  //       prevState < nodes.length - 1 ? prevState + 1 : prevState
  //     );
  //   },
  //   hotkeyOptions
  // );

  // useHotkeys(
  //   "k",
  //   () => {
  //     setSelectedIndex((prevState) =>
  //       prevState > 0 ? prevState - 1 : prevState
  //     );
  //   },
  //   hotkeyOptions
  // );

  // const handleKeyPress = useCallback((event: KeyboardEvent) => {
  //   console.log(`Key pressed: ${event.key}`);

  //   // Prevent default behaviours
  //   if (event.key === "Tab") {
  //     event.preventDefault();
  //   }
  // }, []);

  // useEffect(() => {
  //   // attach the event listener
  //   document.addEventListener("keydown", handleKeyPress);

  //   // remove the event listener
  //   return () => {
  //     document.removeEventListener("keydown", handleKeyPress);
  //   };
  // }, [handleKeyPress]);

  return (
    <div className="h-screen max-w-screen-xl mx-auto">
      <header className="py-6 px-4">
        <h1 className="text-doom-green text-5xl underline">{node?.title}</h1>
      </header>
      <div className="mx-5">
        <NodeItem
          node={node!}
          editState={editState}
          isSelected={false}
          setEditState={setEditState}
        />
      </div>
    </div>
  );
}

export default NodePage;
