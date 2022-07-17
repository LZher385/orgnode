import React, { useCallback, useRef } from "react";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../app/store";
import { NodeItem } from "../../components";
import logging from "../../config/logging";
import { useParams } from "react-router-dom";
import { fetchNodes, nodesSelectors } from "../../features";
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
  const editState = useSelector((state: RootState) => state.global.editState);
  const { id } = useParams();
  const rootNode = useSelector((state: RootState) =>
    nodesSelectors.selectById(state, id!)
  );

  const titleRef = useRef<HTMLInputElement>(null);

  const [titleState, setTitleState] = useState<string>(rootNode!.title);

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
            if ((e.key === "Enter" && e.shiftKey) || e.key === "Escape") {
              // saveTitle(_id, titleRef!.current!.value);
              titleRef.current?.blur();
            }
          }}
        />
        <button>
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
