import { CancelOutlined } from "@mui/icons-material";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { INode, nodesSelectors, refileToList } from "../../features";
import ListObject from "./ListObject";

interface props {
  id: string;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const RefileModal = (props: props) => {
  const dispatch = useDispatch();
  const { id, setIsModalOpen } = props;
  const [nodes, setNodes] = useState<INode[]>(
    useSelector(nodesSelectors.selectAll).filter((node) => node.isRoot)
  );
  // Rendered fewer hooks than expected error when moved into ListObject; find a solution
  const [openedIds, setOpenedIds] = useState<string[]>([]);
  return (
    <div className="border w-80 p-3 text-rose-300">
      <div className="flex justify-between">
        <span className="text-doom-purple font-bold text-2xl underline">
          Refile
        </span>
        <button
          className="hover:text-slate-400"
          onClick={() => {
            setIsModalOpen(false);
          }}
        >
          <CancelOutlined></CancelOutlined>
        </button>
      </div>
      <ul className="">
        <li>
          <button
            className="hover:bg-slate-400 hover:text-slate-900"
            onClick={() => dispatch(refileToList({ idToRefile: id }))}
          >
            Refile as a list node
          </button>
        </li>
        {nodes.map((node, index) => (
          <li
            key={node._id}
            className="hover:bg-slate-400 hover:text-slate-900"
          >
            <ListObject
              idToRefile={id}
              node={node}
              index={index}
              setNodes={setNodes}
              isOpened={openedIds.filter((s) => s === node._id).length !== 0}
              setOpenedIds={setOpenedIds}
            />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RefileModal;
