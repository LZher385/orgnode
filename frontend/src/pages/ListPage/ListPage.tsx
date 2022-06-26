import React, { useCallback, useRef } from "react";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../app/store";
import ListItem from "../../components/ListItem/ListItem";
import logging from "../../config/logging";
import { listNodes, addNode } from "../../features";
import { useKeyPress } from "../../common";

type Props = {};

function ListPage(props: Props) {
  const dispatch = useDispatch();
  const nodes = useSelector((state: RootState) => state.nodes.value);
  const jPress = useKeyPress("j");
  const kPress = useKeyPress("k");

  const [itemsIsCollapsed, setItemsIsCollapsed] = useState<{
    [key: string]: boolean;
  }>({});

  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [selectedId, setSelectedId] = useState<string>("");

  useEffect(() => {
    // Fetching lists
    dispatch(listNodes());
    nodes.forEach((node) => {
      setItemsIsCollapsed({ ...itemsIsCollapsed, [node._id]: false });
    });
  }, [dispatch]);

  useEffect(() => {
    if (nodes.length && jPress) {
      setSelectedIndex((prevState) =>
        prevState < nodes.length - 1 ? prevState + 1 : prevState
      );
    }
  }, [jPress]);
  useEffect(() => {
    if (nodes.length && kPress) {
      setSelectedIndex((prevState) =>
        prevState > 0 ? prevState - 1 : prevState
      );
    }
  }, [kPress]);

  function toggleCollapse(_id: string) {
    setItemsIsCollapsed({ ...itemsIsCollapsed, [_id]: !itemsIsCollapsed[_id] });
  }

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
              />
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}

export default ListPage;
