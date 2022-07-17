import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../app/store";
import { ListItem } from "../../components";
import logging from "../../config/logging";
import { fetchListNodes, nodesSelectors } from "../../features";

type Props = {};

function ListPage(props: Props) {
  const dispatch = useDispatch();

  const nodes = useSelector(nodesSelectors.selectAll);

  useEffect(() => {
    dispatch(fetchListNodes());
  }, [dispatch]);

  return (
    <div className="h-screen max-w-screen-xl mx-auto">
      <header className="py-6 px-4">
        <h1 className="text-doom-green text-5xl underline">Lists</h1>
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
