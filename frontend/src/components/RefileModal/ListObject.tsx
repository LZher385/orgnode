import { ArrowDropDown, ArrowDropUp } from "@mui/icons-material";
import { useState } from "react";
import { useDispatch } from "react-redux";
import logging from "../../config/logging";
import { INode, refileToNode } from "../../features";

interface props {
  idToRefile: string;
  node: INode;
  index: number;
  setNodes: React.Dispatch<React.SetStateAction<INode[]>>;
  isOpened: boolean;
  setOpenedIds: React.Dispatch<React.SetStateAction<string[]>>;
}

const ListObject = (props: props) => {
  const dispatch = useDispatch();
  const { idToRefile, node, index, setNodes, isOpened, setOpenedIds } = props;
  // const isOpened = false;
  // const [isOpened, setIsOpened] = useState<boolean>(false);
  // logging.info(isOpened);
  return (
    <div>
      {node.children.length > 0 && (
        <button
          className="mr-2"
          onClick={() => {
            if (!isOpened) {
              setOpenedIds((state) => [...state, node._id]);
              setNodes((state) => {
                const newState = [...state];
                newState.splice(index + 1, 0, ...node.children);
                return newState;
              });
            } else {
              setOpenedIds((state) => state.filter((n) => n !== node._id));
              setNodes((state) => {
                const newState = [...state];
                newState.splice(index + 1, node.children.length);
                return newState;
              });
            }
          }}
        >
          {isOpened ? <ArrowDropUp /> : <ArrowDropDown />}
        </button>
      )}
      <button
        onClick={() =>
          dispatch(refileToNode({ idToRefile, newParentId: node._id }))
        }
      >
        {node.title}
      </button>
    </div>
  );
};

export default ListObject;
