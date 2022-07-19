import { Add } from "@mui/icons-material";
import React, { useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { useSelector, useDispatch } from "react-redux";
import { ListItem } from "../../components";
import logging from "../../config/logging";
import { addNode, fetchListNodes, nodesSelectors } from "../../features";

type Props = {};

function ListPage(props: Props) {
  const dispatch = useDispatch();

  // TODO can be more efficient
  const nodes = useSelector(nodesSelectors.selectAll).filter(
    (node) => node.isRoot
  );

  logging.info(nodes);

  // useEffect(() => {
  //   dispatch(fetchListNodes());
  // }, [dispatch]);

  return (
    <div className="h-screen max-w-screen-xl mx-auto">
      <header className="py-6 px-4 flex justify-between">
        <h1 className="text-doom-green text-5xl underline">Lists</h1>
        <button
          onClick={() =>
            dispatch(
              addNode({
                node: {
                  _id: uuidv4(),
                  isRoot: true,
                  title: "New List",
                  children: [],
                },
              })
            )
          }
        >
          <Add className="text-doom-green" style={{ fontSize: "50px" }}></Add>
        </button>
      </header>
      <div className="mx-5">
        {nodes.map(function (node) {
          return (
            <React.Fragment key={node._id}>
              <ListItem node={node} />
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}

export default ListPage;
