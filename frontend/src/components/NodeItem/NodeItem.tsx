import React, { useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { v4 as uuidv4 } from "uuid";
import { Collapse } from "react-collapse";
import DatePicker from "react-datepicker";
import {
  Schedule,
  HourglassTop,
  DriveFileMove,
  ArrowDropDown,
  ArrowDropUp,
  DeleteForever,
  Add,
} from "@mui/icons-material";
import Popup from "reactjs-popup";
import { addNode, EditStates, INode, nodesSelectors } from "../../features";
import logging from "../../config/logging";
import "react-datepicker/dist/react-datepicker.css";
import {
  editNodeTitle,
  editNodeDescription,
  editNodeScheduleDate,
  editNodeDeadlineDate,
  deleteNode,
} from "../../features";
import { CustomDatePicker } from "../";
import { RootState } from "../../app/store";
import RefileModal from "../RefileModal/RefileModal";

interface props {
  id: string;
}

function NodeItem(props: props) {
  const dispatch = useDispatch();
  const node = useSelector((state: RootState) =>
    nodesSelectors.selectById(state, props.id)
  );

  const { _id, title, deadlineDate, scheduledDate, description, children } =
    node!;
  const titleRef = useRef<HTMLInputElement>(null);
  const descRef = useRef<HTMLTextAreaElement>(null);
  const scheduleRef = useRef<DatePicker<never, undefined>>(null);
  const deadlineRef = useRef<DatePicker<never, undefined>>(null);

  const [isOpened, setIsOpened] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
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
    dispatch(editNodeTitle({ id, title }));
  };

  const saveDescription = (id: string, desc: string) => {
    dispatch(editNodeDescription({ id, desc }));
  };

  const removeNode = (id: string) => {
    dispatch(deleteNode({ id }));
  };

  const saveListSchedule = (id: string, date: Date) => {
    dispatch(editNodeScheduleDate({ id, date }));
  };

  const saveListDeadline = (id: string, date: Date) => {
    dispatch(editNodeDeadlineDate({ id, date }));
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
            onChange={(e) => {
              setTitleState(e.target.value);
              saveTitle(_id, e.target.value);
            }}
            // onChange={(e) => setTitleState(e.target.value)}
            // onKeyDown={(e) => {
            //   if (e.key === "Enter" || e.key === "Escape") {
            //     saveDescription(_id, titleRef!.current!.value);
            //     titleRef.current?.blur();
            //   }
            // }}
          />
        </div>
        <div className="ml-2">
          <button
            onClick={() => {
              dispatch(
                addNode({
                  parentId: props.id,
                  node: {
                    _id: uuidv4(),
                    parentId: props.id,
                    isRoot: false,
                    title: "New Node",
                    children: [],
                  },
                })
              );
              setIsOpened(true);
            }}
          >
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
          <Popup
            modal
            closeOnEscape
            trigger={
              <button>
                {" "}
                <DriveFileMove className="text-doom-green mx-1" />
              </button>
            }
            open={isModalOpen}
            onOpen={() => setIsModalOpen(true)}
          >
            <RefileModal
              id={props.id}
              setIsModalOpen={setIsModalOpen}
            ></RefileModal>
          </Popup>
          <button onClick={() => removeNode(_id)}>
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
                  setIsOpened(true);
                  logging.info("Calendar opened");
                }}
                onCalendarClose={() => {
                  logging.info("Calendar closed");
                  saveListSchedule(_id, selectedScheDate!);
                }}
              />
            </div>
            <span className="">DEADLINE:&nbsp;</span>
            <CustomDatePicker
              elementRef={deadlineRef}
              selectedDate={selectedDeadDate!}
              setSelectedDate={setSelectedDeadDate}
              onCalendarOpen={() => {
                setIsOpened(true);
                logging.info("Calendar opened");
              }}
              onCalendarClose={() => {
                logging.info("Calendar closed");
                saveListDeadline(_id, selectedDeadDate!);
              }}
            />
          </div>
          <textarea
            ref={descRef}
            className={`focus:outline-none resize-none w-10/12 text-cyan-50 bg-bg-text mx-3 my-2`}
            style={{ height: descHeight < 200 ? descHeight : 200 }}
            value={descState}
            onChange={(e) => {
              setDescState(e.target.value);
              setDescHeight(descRef.current?.scrollHeight!);
              saveDescription(_id, descRef!.current!.value);
            }}
            onFocus={(e) => {
              e.currentTarget.setSelectionRange(
                e.currentTarget.value.length,
                e.currentTarget.value.length
              );
            }}
            // onKeyDown={(e) => {
            //   if (e.key === "Enter" || e.key === "Escape") {
            //     saveDescription(_id, descRef!.current!.value);
            //     descRef.current?.blur();
            //   }
            // }}
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
