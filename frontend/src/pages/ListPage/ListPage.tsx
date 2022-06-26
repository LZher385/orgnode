import React, { KeyboardEventHandler, useCallback, useRef } from "react";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../app/store";
import { useHotkeys, Options } from "react-hotkeys-hook";
import ListItem from "../../components/ListItem/ListItem";
import logging from "../../config/logging";
import { listNodes, addNode, editNodeTitle } from "../../features";

type Props = {};

enum EditStates {
  None,
  Title,
  Desc,
}

function ListPage(props: Props) {
  const dispatch = useDispatch();
  const nodes = useSelector((state: RootState) => state.nodes.value);
  const [itemsIsCollapsed, setItemsIsCollapsed] = useState<{
    [key: string]: boolean;
  }>({});
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [selectedId, setSelectedId] = useState<string>("");
  const [editState, setEditState] = useState<EditStates>(EditStates.None);

  const hotkeyOptions: Options = {
    filter: (e) => nodes.length > 0,
    filterPreventDefault: false,
    keyup: true,
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

  useHotkeys(
    "tab",
    () => {
      toggleCollapse(selectedId);
    },
    hotkeyOptions
  );

  useHotkeys(
    "t",
    () => {
      setEditState(EditStates.Title);
    },
    hotkeyOptions
  );

  useHotkeys(
    "d",
    () => {
      setEditState(EditStates.Desc);
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

  function toggleCollapse(_id: string) {
    setItemsIsCollapsed({ ...itemsIsCollapsed, [_id]: !itemsIsCollapsed[_id] });
  }

  function saveTitle(_id: string, title: string) {
    dispatch(editNodeTitle({ _id, title }));
  }

  const titleKeydownGenerate = (
    titleInputRef: React.RefObject<HTMLInputElement>,
    _id: string
  ): KeyboardEventHandler<HTMLInputElement> => {
    return (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Escape") {
        titleInputRef.current?.blur();
      }
      if (e.key === "Enter") {
        saveTitle(_id, titleInputRef!.current!.value);
        titleInputRef.current?.blur();
      }
      setEditState(EditStates.None);
    };
  };

  const descKeydownGenerate = (
    descRef: React.RefObject<HTMLTextAreaElement>,
    _id: string
  ): KeyboardEventHandler<HTMLTextAreaElement> => {
    return (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Escape") {
        descRef.current?.blur();
      }
      if (e.key === "Enter") {
        saveTitle(_id, descRef!.current!.value);
        descRef.current?.blur();
      }
      setEditState(EditStates.None);
    };
  };

  return (
    <div className="h-screen max-w-screen-xl mx-auto">
      <header className="py-6 px-4">
        <h1 className="text-doom-green text-5xl underline">Lists</h1>
      </header>
      <div className="mx-5">
        {nodes.map(function (node, index) {
          if (selectedIndex === index && selectedId !== node._id) {
            setSelectedId(node._id);
          }
          return (
            <React.Fragment>
              <ListItem
                node={node}
                isCollapsed={itemsIsCollapsed[node._id]}
                toggleCollapse={() => toggleCollapse(node._id)}
                isSelected={selectedId === node._id}
                isEditingTitle={
                  editState === EditStates.Title && selectedId === node._id
                }
                titleKeydownGenerate={titleKeydownGenerate}
                isEditingDesc={
                  editState === EditStates.Desc && selectedId === node._id
                }
                descKeydownGenerate={descKeydownGenerate}
              />
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}

export default ListPage;
