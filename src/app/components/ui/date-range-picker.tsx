import ReactDatePicker, {
  type ReactDatePickerCustomHeaderProps,
  type ReactDatePickerProps,
} from 'react-datepicker';
import {
  type FieldValues,
  type FieldErrors,
  type Path,
  useController,
  type UseControllerProps,
} from 'react-hook-form';
import { format } from 'date-fns';
import Label from './label';
import 'react-datepicker/dist/react-datepicker.css';
import { type MouseEventHandler } from 'react';

type Props<T extends FieldValues> = Omit<
  UseControllerProps<T>,
  'name'
> &
  Pick<
    ReactDatePickerProps,
    | 'minDate'
    | 'maxDate'
    | 'disabled'
    | 'placeholderText'
    | 'required'
    | 'excludeDateIntervals'
  > & {
    label: string;
    startName: Path<T>;
    endName: Path<T>;
    errors?: FieldErrors<T>;
  };

function CustomHeader(props: ReactDatePickerCustomHeaderProps) {
  const handleDecrease: MouseEventHandler = (event) => {
    event.preventDefault();
    props.decreaseMonth();
  };

  const handleIncrease: MouseEventHandler = (event) => {
    event.preventDefault();
    props.increaseMonth();
  };

  return (
    <div className="flex justify-between px-2">
      <button
        onClick={handleDecrease}
        disabled={props.prevMonthButtonDisabled}
        className="text-xl disabled:cursor-not-allowed"
        title="Previous month"
      >
        {'<'}
      </button>
      <span>{format(props.date, 'MMMM')}</span>
      <button
        onClick={handleIncrease}
        disabled={props.nextMonthButtonDisabled}
        className="text-xl disabled:cursor-not-allowed"
        title="Next month"
      >
        {'>'}
      </button>
    </div>
  );
}

function DateRangePicker<T extends FieldValues>({
  control,
  startName,
  endName,
  label,
  ...rest
}: Props<T>) {
  const startController = useController({ control, name: startName });
  const endController = useController({ control, name: endName });

  const handleChange = ([start, end]: [Date, Date]) => {
    startController.field.onChange(start);
    startController.field.onBlur();

    endController.field.onChange(end);
    endController.field.onBlur();
  };

  return (
    <div className="flex flex-col">
      <Label name={label} required={rest.required} />
      <ReactDatePicker
        {...rest}
        onChange={handleChange}
        selected={startController.field.value as Date}
        startDate={startController.field.value as Date}
        endDate={endController.field.value as Date}
        selectsRange
        inline
        renderCustomHeader={CustomHeader}
        showPreviousMonths={false}
      />
    </div>
  );
}

export default DateRangePicker;
