import React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./CustomDatePicker.scss";
import logging from "../../config/logging";

interface Props {
  elementRef: React.RefObject<DatePicker<never, undefined>>;
  selectedDate: Date;
  setSelectedDate: React.Dispatch<React.SetStateAction<Date | undefined>>;
  onKeyDown: (event: React.KeyboardEvent<HTMLDivElement>) => void;
  onCalendarOpen: () => void;
  onCalendarClose: () => void;
}

const CustomDatePicker = (props: Props) => {
  const {
    elementRef,
    selectedDate,
    setSelectedDate,
    onKeyDown,
    onCalendarOpen,
    onCalendarClose,
  } = props;
  return (
    <DatePicker
      className=""
      ref={elementRef}
      selected={selectedDate}
      dateFormat={"dd MMM yy"}
      onChange={(date) => {
        setSelectedDate(date!);
        logging.info("On change");
      }}
      // showTimeSelect
      onKeyDown={onKeyDown}
      minDate={new Date()}
      onCalendarOpen={onCalendarOpen}
      onCalendarClose={onCalendarClose}
    />
  );
};

export default CustomDatePicker;
