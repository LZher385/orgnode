import React, { useEffect } from "react";
import { Collapse } from "react-collapse";
import {
  Schedule,
  HourglassTop,
  DriveFileMove,
  ArrowDropDown,
  ArrowDropUp,
} from "@mui/icons-material";
import { INode } from "../../features";
import logging from "../../config/logging";
import "./ListItem.scss";

interface props {
  node: INode;
  isCollapsed: boolean;
  toggleCollapse: () => void;
  isSelected: boolean;
}

function ListItem(props: props) {
  const { title, deadlineDate, scheduledDate, description } = props.node;
  const { isCollapsed, toggleCollapse, isSelected } = props;

  useEffect(() => {
    logging.info("use effect " + title);
  });

  return (
    <div
      className={`mb-5 mx-4 px-3 py-3 ${
        isSelected ? "bg-gray-100" : "bg-inherit"
      }`}
    >
      <div className="flex justify-between">
        <h2 className="text-doom-green text-2xl">
          <span>&#x2022; </span>
          {title}
          <button onClick={toggleCollapse}>
            {isCollapsed ? <ArrowDropUp /> : <ArrowDropDown />}
          </button>
        </h2>
        <div className="">
          <button>
            <Schedule className="text-doom-green mx-1" />
          </button>
          <button>
            <HourglassTop className="text-doom-green mx-1" />
          </button>
          <button>
            <DriveFileMove className="text-doom-green mx-1" />
          </button>
        </div>
      </div>

      <div className="ml-3">
        <Collapse isOpened={isCollapsed}>
          <div className="flex text-rose-300">
            <span className="">SCHEDULED: {scheduledDate?.toDateString()}</span>
            <span className="ml-3">
              DEADLINE: {deadlineDate?.toDateString()}
            </span>
          </div>
          <div>{description}</div>
        </Collapse>
      </div>
    </div>
  );
}

export default ListItem;
