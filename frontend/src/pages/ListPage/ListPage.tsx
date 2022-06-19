import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../app/store";
import { listNodes, addNode } from "../../features/nodeSlice";

type Props = {};

function ListPage(props: Props) {
  const dispatch = useDispatch();
  const nodes = useSelector((state: RootState) => state.nodes.value);

  // const [nodes, setNodes] = useState<INode
  useEffect(() => {
    dispatch(listNodes());
  },[dispatch]);

  return (
    <div className="h-screen">
      <header className="py-6 px-4">
        <h1 className="text-doom-green text-5xl underline">Lists</h1>
      </header>
      <div>
        {nodes.map((node) => (
          <h3>{node.title}</h3>
        ))}
      </div>
      <button onClick={() => dispatch(addNode())}>test</button>
    </div>
  );
}

export default ListPage;
