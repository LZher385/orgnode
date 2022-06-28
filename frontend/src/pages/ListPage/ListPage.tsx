import React, { KeyboardEventHandler, useCallback, useRef } from "react";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../app/store";
import { useHotkeys, Options } from "react-hotkeys-hook";
import { ListItem } from "../../components";
import logging from "../../config/logging";
import { listNodes, addNode } from "../../features";

type Props = {};

export enum EditStates {
  None,
  Title,
  Desc,
  Schedule,
  Deadline,
}

function ListPage(props: Props) {
  const dispatch = useDispatch();
  const nodes = useSelector((state: RootState) => state.nodes.value);
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [editState, setEditState] = useState<EditStates>(EditStates.None);
  const indexToIdMap: { [key: number]: string } = {};
  nodes.forEach((node, idx) => {
    indexToIdMap[idx] = node._id;
  });
  const selectedId = indexToIdMap[selectedIndex];

  // Hotkeys
  const hotkeyOptions: Options = {
    filter: (e) =>
      nodes.length > 0 &&
      editState !== EditStates.Schedule &&
      editState !== EditStates.Deadline,
    filterPreventDefault: false,
    keydown: true,
  };

  useHotkeys(
    "j",
    () => {
      setSelectedIndex((prevState) =>
        prevState < nodes.length - 1 ? prevState + 1 : prevState
      );
    },
    hotkeyOptions
  );

  useHotkeys(
    "k",
    () => {
      setSelectedIndex((prevState) =>
        prevState > 0 ? prevState - 1 : prevState
      );
    },
    hotkeyOptions
  );

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
        <h1 className="text-doom-green text-5xl underline">Lists</h1>
      </header>
      <div className="mx-5">
        {nodes.map(function (node) {
          return (
            <React.Fragment key={node._id}>
              <ListItem
                node={node}
                editState={editState}
                isSelected={node._id === selectedId}
                setEditState={setEditState}
              />
            </React.Fragment>
          );
        })}
      </div>
      <button onClick={() => dispatch(addNode())}>Add dummy node</button>
    </div>
  );
}

export default ListPage;
