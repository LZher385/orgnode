import React, { useCallback, useRef } from "react";
import { v4 as uuidv4 } from "uuid";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../app/store";
import { NodeItem } from "../../components";
import logging from "../../config/logging";
import { useParams } from "react-router-dom";
import {
  addNode,
  editNodeTitle,
  fetchNodes,
  nodesSelectors,
} from "../../features";
import { Add } from "@mui/icons-material";
import { fontSize } from "@mui/system";

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
  const { id } = useParams();
  const rootNode = useSelector((state: RootState) =>
    nodesSelectors.selectById(state, id!)
  );

  const titleRef = useRef<HTMLInputElement>(null);

  const [titleState, setTitleState] = useState<string>(rootNode!.title);

  const saveTitle = (title: string) => {
    dispatch(editNodeTitle({ id: id!, title }));
  };

  return (
    <div className="h-screen max-w-screen-xl mx-auto">
      <header className="py-6 px-4 flex">
        <input
          ref={titleRef}
          type="text"
          className="focus:outline-none inline-block flex-grow bg-inherit text-doom-green text-5xl underline"
          value={titleState}
          onChange={(e) => setTitleState(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === "Escape") {
              titleRef.current?.blur();
            }
          }}
          onBlur={(e) => {
            saveTitle(e.target.value);
          }}
        />
        <button
          onClick={() => {
            dispatch(
              addNode({
                parentId: id,
                node: {
                  _id: uuidv4(),
                  parentId: id,
                  isRoot: false,
                  title: "New Node",
                  children: [],
                },
              })
            );
          }}
        >
          <Add className="text-doom-green" style={{ fontSize: "50px" }}></Add>
        </button>
      </header>
      {rootNode!.children?.map((child) => (
        <div className="ml-2" key={child._id}>
          <NodeItem id={child._id} />
        </div>
      ))}
    </div>
  );
}

export default NodePage;
