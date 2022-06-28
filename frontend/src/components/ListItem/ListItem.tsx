import React, {
  KeyboardEventHandler,
  useEffect,
  useRef,
  useState,
} from "react";
import { useSelector, useDispatch } from "react-redux";
import { Collapse } from "react-collapse";
import DatePicker from "react-datepicker";
import {
  Schedule,
  HourglassTop,
  DriveFileMove,
  ArrowDropDown,
  ArrowDropUp,
  DeleteForever,
} from "@mui/icons-material";
import { INode } from "../../features";
import logging from "../../config/logging";
import { EditStates } from "../../pages/ListPage/ListPage";
import "react-datepicker/dist/react-datepicker.css";
import "./ListItem.scss";
import {
  editListTitle,
  editListDescription,
  editListScheduledDate,
  editListDeadlineDate,
  deleteList,
} from "../../features";
import { useHotkeys, Options } from "react-hotkeys-hook";

interface props {
  node: INode;
  isSelected: boolean;
  editState: EditStates;
  setEditState: React.Dispatch<React.SetStateAction<EditStates>>;
}

function ListItem(props: props) {
  const dispatch = useDispatch();
  const { _id, title, deadlineDate, scheduledDate, description } = props.node;
  const { isSelected, editState, setEditState } = props;

  const titleRef = useRef<HTMLInputElement>(null);
  const descRef = useRef<HTMLTextAreaElement>(null);
  const scheduleRef = useRef<DatePicker<never, undefined>>(null);

  const [isOpened, setIsOpened] = useState<boolean>(false);
  const [titleState, setTitleState] = useState<string>(title);
  const [descState, setDescState] = useState<string>(description ?? "");
  const [descHeight, setDescHeight] = useState<number>(
    descRef.current?.scrollHeight ?? 48
  );
  const [selectedScheDate, setSelectedScheDate] = useState<Date | undefined>(
    scheduledDate
  );
  const [selectedDeadDate, setSelectedDeadDate] = useState<Date | undefined>();

  const hotkeyOptions: Options = {
    filter: (e) =>
      isSelected &&
      editState !== EditStates.Schedule &&
      editState !== EditStates.Deadline,
    filterPreventDefault: false,
    keydown: true,
  };

  useHotkeys(
    "tab",
    () => {
      setIsOpened((prev) => !prev);
    },
    hotkeyOptions
  );

  useHotkeys(
    "i",
    () => {
      setEditState(EditStates.Title);
      titleRef.current?.focus();
    },
    { ...hotkeyOptions, keyup: true, keydown: false }
  );

  useHotkeys(
    "shift + i",
    () => {
      setEditState(EditStates.Desc);
      setIsOpened(true);
      descRef.current?.focus();
    },
    { ...hotkeyOptions, keyup: true, keydown: false }
  );

  useHotkeys(
    "Delete",
    () => {
      removeList(_id);
    },
    hotkeyOptions
  );

  useHotkeys(
    "s",
    () => {
      setEditState(EditStates.Schedule);
      setIsOpened(true);
      scheduleRef.current?.setFocus();
    },
    { ...hotkeyOptions, keyup: true, keydown: false }
  );

  const saveTitle = (_id: string, title: string) => {
    dispatch(editListTitle({ _id, title }));
  };

  const saveDescription = (_id: string, desc: string) => {
    dispatch(editListDescription({ _id, desc }));
  };

  const removeList = (_id: string) => {
    dispatch(deleteList(_id));
  };

  const scheduleList = (_id: string, date: Date) => {
    dispatch(editListScheduledDate({ _id, date }));
  };

  const deadlineList = (_id: string, date: Date) => {
    dispatch(editListDeadlineDate({ _id, date }));
  };

  return (
    <div
      className={`mb-5 mx-4 px-3 py-3 ${
        isSelected ? "bg-gray-100" : "bg-inherit"
      }`}
    >
      <div className="flex justify-between">
        <div className="text-doom-green text-2xl flex-grow flex">
          <button className="mr-2" onClick={() => setIsOpened((prev) => !prev)}>
            {isOpened ? <ArrowDropUp /> : <ArrowDropDown />}
          </button>
          {/* <span>&#x2022; </span> */}
          <input
            ref={titleRef}
            type="text"
            className="focus:outline-none inline-block flex-grow"
            value={titleState}
            onChange={(e) => setTitleState(e.target.value)}
            onKeyDown={(e) => {
              if ((e.key === "Enter" && e.shiftKey) || e.key === "Escape") {
                saveTitle(_id, titleRef!.current!.value);
                titleRef.current?.blur();
              }
              setEditState(EditStates.None);
            }}
          />
        </div>
        <div className="ml-2">
          <button
            onClick={() => {
              scheduleRef.current?.setFocus();
            }}
          >
            <Schedule className="text-doom-green mx-1" />
          </button>
          <button>
            <HourglassTop className="text-doom-green mx-1" />
          </button>
          <button>
            <DriveFileMove className="text-doom-green mx-1" />
          </button>
          <button onClick={() => removeList(_id)}>
            <DeleteForever className="text-doom-green mx -1" />
          </button>
        </div>
      </div>

      <div className="ml-3">
        <Collapse isOpened={isOpened}>
          <div className="flex text-rose-300">
            {/* <span className="">SCHEDULED: {scheduledDate?.toDateString()}</span> */}
            <DatePicker
              ref={scheduleRef}
              selected={selectedScheDate}
              placeholderText={`SCHEDULED: ${scheduledDate}`}
              onChange={(date) => setSelectedScheDate(date!)}
              // showTimeSelect
              onKeyDown={(e) => {
                if (e.key === "Escape") {
                  scheduleRef.current?.setBlur();
                }
              }}
              minDate={new Date()}
              onCalendarOpen={() => {
                logging.info("Calendar opened");
                // setEditState(EditStates.Schedule);
              }}
              onCalendarClose={() => {
                logging.info("Calendar closed");
                // scheduleRef.current?.setBlur();
                setEditState(EditStates.None);
                // setTest(false);
              }}
            />
            {/* <span className="ml-3">
              DEADLINE: {deadlineDate?.toDateString()}
            </span> */}
          </div>
          <textarea
            ref={descRef}
            className={`focus:outline-none resize-none w-full`}
            style={{ height: descHeight < 200 ? descHeight : 200 }}
            value={descState}
            onChange={(e) => {
              setDescState(e.target.value);
              setDescHeight(descRef.current?.scrollHeight!);
            }}
            onKeyDown={(e) => {
              if ((e.key === "Enter" && e.shiftKey) || e.key === "Escape") {
                saveTitle(_id, descRef!.current!.value);
                descRef.current?.blur();
              }
              setEditState(EditStates.None);
            }}
          />
        </Collapse>
      </div>
    </div>
  );
}

export default ListItem;
