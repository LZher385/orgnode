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
import {
  EditStates,
  INode,
  setCurrentId,
  setEditState,
  toggleOpenedId,
} from "../../features";
import logging from "../../config/logging";
import "react-datepicker/dist/react-datepicker.css";
import {
  editListTitle,
  editListDescription,
  editListScheduledDate,
  editListDeadlineDate,
  deleteList,
} from "../../features";
import { CustomDatePicker } from "../";
import { useHotkeys, Options } from "react-hotkeys-hook";
import { RootState } from "../../app/store";

interface props {
  node: INode;
}

function NodeItem(props: props) {
  const dispatch = useDispatch();
  const editState = useSelector((state: RootState) => state.global.editState);
  const { _id, title, deadlineDate, scheduledDate, description, children } =
    props.node;
  const isSelected =
    useSelector((state: RootState) => state.global.currentId) === _id;
  const isOpened =
    _id in useSelector((state: RootState) => state.global.openedIds);
  const titleRef = useRef<HTMLInputElement>(null);
  const descRef = useRef<HTMLTextAreaElement>(null);
  const scheduleRef = useRef<DatePicker<never, undefined>>(null);
  const deadlineRef = useRef<DatePicker<never, undefined>>(null);

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
    filter: (_) =>
      isSelected &&
      editState !== EditStates.Schedule &&
      editState !== EditStates.Deadline,
    filterPreventDefault: false,
    keydown: true,
  };

  useHotkeys(
    "tab",
    () => {
      dispatch(toggleOpenedId({ id: _id }));
    },
    hotkeyOptions
  );

  useHotkeys(
    "i",
    () => {
      dispatch(setEditState({ editState: EditStates.Title }));
      titleRef.current?.focus();
    },
    { ...hotkeyOptions, keyup: true, keydown: false }
  );

  useHotkeys(
    "shift + i",
    () => {
      dispatch(setEditState({ editState: EditStates.Desc }));
      dispatch(toggleOpenedId({ id: _id }));
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
      dispatch(setEditState({ editState: EditStates.Schedule }));
      dispatch(toggleOpenedId({ id: _id }));
      scheduleRef.current?.setFocus();
    },
    { ...hotkeyOptions, keyup: true, keydown: false }
  );

  useHotkeys(
    "d",
    () => {
      dispatch(setEditState({ editState: EditStates.Deadline }));
      dispatch(toggleOpenedId({ id: _id }));
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
          <button
            className="mr-2"
            onClick={() => dispatch(toggleOpenedId({ id: _id }))}
          >
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
              dispatch(setEditState({ editState: EditStates.None }));
            }}
          />
        </div>
        <div className="ml-2">
          <button
            onClick={() => {
              scheduleRef.current?.setFocus();
            }}
          >
            <Schedule className="text-doom-green mx-1" />{" "}
          </button>{" "}
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
            <div className="mr-2">
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
                  dispatch(setEditState({ editState: EditStates.None }));
                }}
              />
            </div>
            <span className="">DEADLINE:&nbsp;</span>
            <CustomDatePicker
              elementRef={deadlineRef}
              selectedDate={selectedDeadDate!}
              setSelectedDate={setSelectedDeadDate}
              onKeyDown={(e) => {
                if (e.key === "Escape") {
                  deadlineRef.current?.setBlur();
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
                dispatch(setEditState({ editState: EditStates.None }));
              }}
            />
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

              dispatch(setEditState({ editState: EditStates.None }));
            }}
          />
          {children?.map((child) => (
            <div className="ml-2" key={child._id}>
              <NodeItem node={child}/>
            </div>
          ))}
        </Collapse>
      </div>
    </div>
  );
}

export default NodeItem;
