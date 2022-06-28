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
import { CustomDatePicker } from "../";
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
  const deadlineRef = useRef<DatePicker<never, undefined>>(null);

  const [isOpened, setIsOpened] = useState<boolean>(false);
  const [titleState, setTitleState] = useState<string>(title);
  const [descState, setDescState] = useState<string>(description ?? "");
  const [descHeight, setDescHeight] = useState<number>(
    descRef.current?.scrollHeight ?? 48
  );
  const [selectedScheDate, setSelectedScheDate] = useState<Date | undefined>(
    scheduledDate
  );
  const [selectedDeadDate, setSelectedDeadDate] = useState<Date | undefined>(
    deadlineDate
  );

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

  useHotkeys(
    "d",
    () => {
      setEditState(EditStates.Deadline);
      setIsOpened(true);
      deadlineRef.current?.setFocus();
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

  const saveListSchedule = (_id: string, date: Date) => {
    dispatch(editListScheduledDate({ _id, date }));
  };

  const saveListDeadline = (_id: string, date: Date) => {
    dispatch(editListDeadlineDate({ _id, date }));
  };

  return (
    <div className={`px-3 py-3 ${isSelected ? "bg-gray-800/75" : ""}`}>
      <div className="flex justify-between">
        <div className="text-doom-green text-2xl flex-grow">
          <button className="mr-2" onClick={() => setIsOpened((prev) => !prev)}>
            {isOpened ? <ArrowDropUp /> : <ArrowDropDown />}
          </button>
          <input
            ref={titleRef}
            type="text"
            className="focus:outline-none inline-block flex-grow bg-inherit"
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
            <DeleteForever className="text-doom-green mx-1" />
          </button>
        </div>
      </div>
      <div className="ml-3">
        <Collapse isOpened={isOpened}>
          <div className="flex text-rose-300">
            {/* <div className=""> */}
            <span className="">SCHEDULED:&nbsp;</span>
            <CustomDatePicker
              elementRef={scheduleRef}
              selectedDate={selectedScheDate!}
              setSelectedDate={setSelectedScheDate}
              onKeyDown={(e) => {
                if (e.key === "Escape") {
                  scheduleRef.current?.setBlur();
                }
                if (e.key === "Enter") {
                  saveListSchedule(_id, selectedScheDate!);
                  scheduleRef.current?.setBlur();
                }
              }}
              onCalendarOpen={() => {
                logging.info("Calendar opened");
              }}
              onCalendarClose={() => {
                logging.info("Calendar closed");
                setEditState(EditStates.None);
              }}
            />
            {/* </div> */}
            {/* <div> */}
            <span className="">DEADLINE:&nbsp;</span>
            <CustomDatePicker
              elementRef={deadlineRef}
              selectedDate={selectedDeadDate!}
              setSelectedDate={setSelectedDeadDate}
              onKeyDown={(e) => {
                if (e.key === "Escape") {
                  scheduleRef.current?.setBlur();
                }
                if (e.key === "Enter") {
                  saveListDeadline(_id, selectedDeadDate!);
                  deadlineRef.current?.setBlur();
                }
              }}
              onCalendarOpen={() => {
                logging.info("Calendar opened");
              }}
              onCalendarClose={() => {
                logging.info("Calendar closed");
                setEditState(EditStates.None);
              }}
            />
            {/* </div> */}
          </div>
          <textarea
            ref={descRef}
            className={`focus:outline-none resize-none w-full text-cyan-50 bg-inherit`}
            style={{ height: descHeight < 200 ? descHeight : 200 }}
            value={descState}
            onChange={(e) => {
              setDescState(e.target.value);
              setDescHeight(descRef.current?.scrollHeight!);
            }}
            onFocus={(e) => {
              e.currentTarget.setSelectionRange(
                e.currentTarget.value.length,
                e.currentTarget.value.length
              );
            }}
            onKeyDown={(e) => {
              if ((e.key === "Enter" && e.shiftKey) || e.key === "Escape") {
                saveDescription(_id, descRef!.current!.value);
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
