import React, {
  KeyboardEventHandler,
  useEffect,
  useRef,
  useState,
} from "react";
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
  isEditingTitle: boolean;
  titleKeydownGenerate: (
    titleInputRef: React.RefObject<HTMLInputElement>,
    _id: string
  ) => KeyboardEventHandler<HTMLInputElement>;
  isEditingDesc: boolean;
  descKeydownGenerate: (
    titleInputRef: React.RefObject<HTMLTextAreaElement>,
    _id: string
  ) => KeyboardEventHandler<HTMLTextAreaElement>;
}

function ListItem(props: props) {
  const { _id, title, deadlineDate, scheduledDate, description } = props.node;
  const { isCollapsed, isSelected, isEditingTitle, isEditingDesc } = props;
  const { toggleCollapse, titleKeydownGenerate, descKeydownGenerate } = props;
  const titleRef = useRef<HTMLInputElement>(null);
  const descRef = useRef<HTMLTextAreaElement>(null);

  const [titleState, setTitleState] = useState<string>(title);
  const [descState, setDescState] = useState<string>(description ?? "");

  useEffect(() => {
    // logging.info("use effect " + title);
    if (isEditingTitle) {
      titleRef.current?.focus();
    }
    if (isEditingDesc) {
      descRef.current?.focus();
    }
  });

  return (
    <div
      className={`mb-5 mx-4 px-3 py-3 ${
        isSelected ? "bg-gray-100" : "bg-inherit"
      }`}
    >
      <div className="flex justify-between">
        <div className="text-doom-green text-2xl flex-grow flex">
          <button className="mr-2" onClick={toggleCollapse}>
            {isCollapsed ? <ArrowDropUp /> : <ArrowDropDown />}
          </button>
          {/* <span>&#x2022; </span> */}
          <input
            ref={titleRef}
            type="text"
            className="focus:outline-none inline-block flex-grow"
            value={titleState}
            onChange={(e) => setTitleState(e.target.value)}
            onKeyDown={titleKeydownGenerate(titleRef, _id)}
          />
        </div>
        <div className="ml-2">
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
          {/* <div>{description}</div> */}
          <textarea
            ref={descRef}
            rows={5}
            className="focus:outline-none resize-none w-full"
            value={descState}
            onChange={(e) => setDescState(e.target.value)}
            onKeyDown={descKeydownGenerate(descRef, _id)}
          />
        </Collapse>
      </div>
    </div>
  );
}

export default ListItem;
