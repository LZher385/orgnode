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
} from "@mui/icons-material";
import { fetchNodes, INode, setEditState } from "../../features";
import logging from "../../config/logging";
import "react-datepicker/dist/react-datepicker.css";
import "./ListItem.scss";
import {
  editListTitle,
  editListDescription,
  editListScheduledDate,
  editListDeadlineDate,
  deleteList,
  EditStates,
} from "../../features";
import { CustomDatePicker } from "../";
import { RootState } from "../../app/store";
import { useNavigate } from "react-router-dom";

interface props {
  node: INode;
}

function ListItem(props: props) {
  const dispatch = useDispatch();
  let navigate = useNavigate();
  const editState = useSelector((state: RootState) => state.global.editState);
  const { _id, title, deadlineDate, scheduledDate, description } = props.node;

  const descRef = useRef<HTMLTextAreaElement>(null);
  const scheduleRef = useRef<DatePicker<never, undefined>>(null);
  const deadlineRef = useRef<DatePicker<never, undefined>>(null);

  const [isOpened, setIsOpened] = useState<boolean>(false);
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
    <div className={"px-3 py-3"}>
      <div className="flex justify-between">
        <div className="text-doom-green text-2xl flex-grow">
          <button className="mr-2" onClick={() => setIsOpened((prev) => !prev)}>
            {isOpened ? <ArrowDropUp /> : <ArrowDropDown />}
          </button>
          <button
            onClick={() => {
              dispatch(fetchNodes({ id: _id }));
              navigate(`/node/${_id}`);
            }}
          >
            {title}
          </button>
        </div>
        <div className="ml-2">
          <button
            onClick={() => {
              dispatch(setEditState({ editState: EditStates.Schedule }));
              setIsOpened(true);
              scheduleRef.current?.setFocus();
            }}
          >
            <Schedule className="text-doom-green mx-1" />{" "}
          </button>{" "}
          <button
            onClick={() => {
              dispatch(setEditState({ editState: EditStates.Deadline }));
              setIsOpened(true);
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
                // onKeyDown={(e) => {
                //   if (e.key === "Escape") {
                //     scheduleRef.current?.setBlur();
                //   }
                //   if (e.key === "Enter") {
                //     saveListSchedule(_id, selectedScheDate!);
                //     scheduleRef.current?.setBlur();
                //   }
                // }}
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
          />
        </Collapse>
      </div>
    </div>
  );
}

export default ListItem;
