import React, { useRef, useState } from "react";
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
  PlusOne,
  Add,
} from "@mui/icons-material";
import { EditStates, INode, nodesSelectors } from "../../features";
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
import { RootState } from "../../app/store";

interface props {
  id: string;
}

function NodeItem(props: props) {
  const dispatch = useDispatch();
  const node = useSelector((state: RootState) =>
    nodesSelectors.selectById(state, props.id)
  );
  // console.log(props.id);
  // console.log(node);

  const { _id, title, deadlineDate, scheduledDate, description, children } =
    node!;
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

  const saveTitle = (id: string, title: string) => {
    dispatch(editListTitle({ id, title }));
  };

  const saveDescription = (id: string, desc: string) => {
    dispatch(editListDescription({ id, desc }));
  };

  const removeList = (id: string) => {
    dispatch(deleteList({ id }));
  };

  const saveListSchedule = (id: string, date: Date) => {
    dispatch(editListScheduledDate({ id, date }));
  };

  const saveListDeadline = (id: string, date: Date) => {
    dispatch(editListDeadlineDate({ id, date }));
  };

  return (
    <div>
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
          />
        </div>
        <div className="ml-2">
          <button>
            <Add className="text-doom-green mx-1" />
          </button>
          <button
            onClick={() => {
              scheduleRef.current?.setFocus();
            }}
          >
            <Schedule className="text-doom-green mx-1" />
          </button>
          <button
            onClick={() => {
              deadlineRef.current?.setFocus();
            }}
          >
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
                onCalendarOpen={() => {
                  logging.info("Calendar opened");
                }}
                onCalendarClose={() => {
                  logging.info("Calendar closed");
                }}
              />
            </div>
            <span className="">DEADLINE:&nbsp;</span>
            <CustomDatePicker
              elementRef={deadlineRef}
              selectedDate={selectedDeadDate!}
              setSelectedDate={setSelectedDeadDate}
              onCalendarOpen={() => {
                logging.info("Calendar opened");
              }}
              onCalendarClose={() => {
                logging.info("Calendar closed");
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
            }}
          />
          {children?.map((child) => (
            <div className="ml-2" key={child._id}>
              <NodeItem id={child._id} />
            </div>
          ))}
        </Collapse>
      </div>
    </div>
  );
}

export default NodeItem;
