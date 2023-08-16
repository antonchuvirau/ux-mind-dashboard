'use client';
import { useSearchParams } from 'next/navigation';
import { type HubstaffActivity } from '../hubstaffValidators';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import lastDayOfMonth from 'date-fns/lastDayOfMonth';
import addDays from 'date-fns/addDays';
import getDaysInMonth from 'date-fns/getDaysInMonth';

interface Props {
  activities: HubstaffActivity[];
  date: Date;
  monthId?: number;
}

const TrackedRange = ({ activities, date, monthId = (new Date()).getMonth() }: Props) => {
  const params = useSearchParams();
  const [startDate, setStartDate] = useState(
    params.get("startDate")
    ? new Date(String(params.get("startDate")))
    : new Date(`2023-${monthId < 10 ? "0" + String(monthId) : monthId}-01`)
  );
  const [endDate, setEndDate] = useState(
    params.get("endDate")
    ? new Date(String(params.get("endDate")))
    : new Date(`2023-${monthId < 10 ? "0" + String(monthId) : monthId}-${getDaysInMonth(date)}`)
  );
  const [startDay, setStartDay] = useState(1);
  const [endDay, setEndDay] = useState(getDaysInMonth(date));
  const [hoveredDay, setHoveredDay] = useState(-1);
  const [changeStartDay, setChangeStartDay] = useState(false);
  const [changeEndDay, setChangeEndDay] = useState(false);
  const router = useRouter();

  const handleChangeStartDate = (date: Date) => {
    setStartDate(date);
    router.push("/tracked/" + String(monthId) + "?startDate=" + date.toISOString().slice(0,10) + "&endDate=" + endDate.toISOString().slice(0,10));
  }

  const handleChangeEndDate = (date: Date) => {
    setEndDate(date);
    router.push("/tracked/" + String(monthId) + "?startDate=" + startDate.toISOString().slice(0,10) + "&endDate=" + date.toISOString().slice(0,10));
  }

  //console.log("activities");
  //console.log(activities.length);
  
  const trackedTime = activities.reduce(
    (sum, activity) => (activity.tracked ? sum + activity.tracked : sum),
    0
  );

  const handleDayClick = (i: number) => {
    if (i === startDay - 1 && changeStartDay === false && changeEndDay !== true) {
      setChangeStartDay(true);
      setHoveredDay(i + 1);
    }
    if (i === endDay - 1 && changeEndDay === false && changeStartDay !== true) {
      setChangeEndDay(true);
      setHoveredDay(i + 1);
    }
    if (changeStartDay === true) {
      if (i < endDay - 1) {
        setStartDay(i + 1);
        handleChangeStartDate(new Date(`2023-${monthId < 10 ? "0" + String(monthId) : monthId}-${i + 1 < 10 ? "0" + String(i + 1) : i + 1}`));
        setChangeStartDay(false);
        setHoveredDay(-1);
      }
    }
    if (changeEndDay === true) {
      if (i > startDay - 1) {
        setEndDay(i + 1);
        handleChangeEndDate(new Date(`2023-${monthId < 10 ? "0" + String(monthId) : monthId}-${i + 1 < 10 ? "0" + String(i + 1) : i + 1}`));
        setChangeEndDay(false);
        setHoveredDay(-1);
      }
    }
  }

  const handleDayHover = (i: number) => {
    if (changeStartDay === true) {
      if (i < endDay - 1) {
        setHoveredDay(i + 1);
      }
    }
    if (changeEndDay === true) {
      if (i > startDay - 1) {
        setHoveredDay(i + 1);
      }
    }
  }

  return (
    <div>
      <div className="grid grid-cols-7 gap-4 max-w-md">
        {Array.from({length: getDaysInMonth(date)}).map((e, i) =>
          <div
            key={i}
            className={
              `p-2 border-solid border-2 hover:bg-gray-200/50 cursor-pointer 
              ${(i > startDay - 1 && i < endDay - 1 && !changeStartDay && !changeEndDay) ? "bg-green-400" : ""}
              ${((i === startDay - 1 && !changeStartDay) || (i === endDay - 1 && !changeEndDay)) ? "bg-green-400" : ""}
              ${changeStartDay && i >= hoveredDay - 1 && i < endDay - 1 ? "bg-green-400" : ""}
              ${changeEndDay && i <= hoveredDay - 1 && i > startDay - 1 ? "bg-green-400" : ""}`
            }
            onClick={() => handleDayClick(i)}
            onMouseOver={() => handleDayHover(i)}
          >
            {i+1}
          </div>
        )}
      </div>
      <div className="text-primary mb-2 mt-10 text-2xl leading-tight">
        Start date
      </div>
      <input
        className="mb-8 block h-16 w-80 rounded-xl border-2 border-solid border-black p-2"
        type="date"
        placeholder="Start date"
        onChange={(e) => handleChangeStartDate(new Date(e.target.value))}
        value={
          params.get("startDate")
          ? String(params.get("startDate"))
          : (date).toISOString().slice(0,10)
        }
      />
      <div className="text-primary mb-2 mt-0 text-2xl leading-tight">
        End date
      </div>
      <input
        className="mb-8 block h-16 w-80 rounded-xl border-2 border-solid border-black p-2"
        type="date"
        placeholder="End date"
        onChange={(e) => handleChangeEndDate(new Date(e.target.value))}
        value={
          params.get("endDate")
          ? String(params.get("endDate"))
          : (addDays(lastDayOfMonth(date),1)).toISOString().slice(0,10)
        }
      />
      <div className="text-primary mb-2 mt-0 text-2xl leading-tight">
        Hours: {Math.trunc(trackedTime / 3600)}
      </div>
    </div>
  );
};

export default TrackedRange;
