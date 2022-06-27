import React, { KeyboardEventHandler, useCallback, useRef } from "react";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../app/store";
import { useHotkeys, Options } from "react-hotkeys-hook";
import ListItem from "../../components/ListItem/ListItem";
import logging from "../../config/logging";
import {
  listNodes,
  addNode,
  editListTitle,
  editListDescription,
  editListScheduledDate,
  editListDeadlineDate,
  deleteList,
} from "../../features";

type Props = {};

enum EditStates {
  None,
  Title,
  Desc,
}

function ListPage(props: Props) {
  const dispatch = useDispatch();
  const nodes = useSelector((state: RootState) => state.nodes.value);
  // change to state
  const test: { [key: number]: string } = {};
  nodes.forEach((node, idx) => {
    test[idx] = node._id;
  });
  const [itemsIsCollapsed, setItemsIsCollapsed] = useState<{
    [key: string]: boolean;
  }>({});
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  // const [selectedId, setSelectedId] = useState<string>(nodes[0]._id);
  const [editState, setEditState] = useState<EditStates>(EditStates.None);

  const selectedId = test[selectedIndex];

  const hotkeyOptions: Options = {
    filter: (e) => nodes.length > 0,
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

  useHotkeys(
    "tab",
    () => {
      toggleCollapse(selectedId);
    },
    hotkeyOptions
  );

  useHotkeys(
    "i",
    () => {
      setEditState(EditStates.Title);
    },
    { ...hotkeyOptions, keyup: true, keydown: false }
  );

  useHotkeys(
    "shift + i",
    () => {
      setEditState(EditStates.Desc);
      setItemsIsCollapsed({ ...itemsIsCollapsed, [selectedId]: true });
    },
    { ...hotkeyOptions, keyup: true, keydown: false }
  );

  useHotkeys(
    "Delete",
    () => {
      removeList(selectedId);
    },
    [selectedId]
  );

  useHotkeys("s", () => {});

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

  const toggleCollapse = (_id: string) => {
    setItemsIsCollapsed({ ...itemsIsCollapsed, [_id]: !itemsIsCollapsed[_id] });
  };

  const saveTitle = (_id: string, title: string) => {
    dispatch(editListTitle({ _id, title }));
  };

  const removeList = (_id: string) => {
    dispatch(deleteList(_id));
  };

  const scheduleList = (_id: string, date: Date) => {
    dispatch(editListScheduledDate({ _id, date }));
  };

  const deadlineList = (_id: string, date: Date) => {
    dispatch(editListDeadlineDate({ _id, date }));
  };

  const titleKeydownGenerate = (
    titleInputRef: React.RefObject<HTMLInputElement>,
    _id: string
  ): KeyboardEventHandler<HTMLInputElement> => {
    return (e: React.KeyboardEvent<HTMLInputElement>) => {
      // if (e.key === "Escape") {
      // titleInputRef.current?.blur();
      // }
      if ((e.key === "Enter" && e.shiftKey) || e.key === "Escape") {
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
      // if (e.key === "Escape") {
      // descRef.current?.blur();
      // }
      if ((e.key === "Enter" && e.shiftKey) || e.key === "Escape") {
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
          const isSelected = selectedId === node._id;
          // if (selectedIndex === index && !isSelected) {
          //   setSelectedId(node._id);
          // }
          return (
            <React.Fragment key={node._id}>
              <ListItem
                node={node}
                isCollapsed={itemsIsCollapsed[node._id]}
                toggleCollapse={() => toggleCollapse(node._id)}
                isSelected={selectedId === node._id}
                isEditingTitle={editState === EditStates.Title && isSelected}
                titleKeydownGenerate={titleKeydownGenerate}
                isEditingDesc={editState === EditStates.Desc && isSelected}
                descKeydownGenerate={descKeydownGenerate}
                removeList={removeList}
              />
            </React.Fragment>
          );
        })}
      </div>
      <button onClick={() => dispatch(addNode())}>Add node</button>
    </div>
  );
}

export default ListPage;
