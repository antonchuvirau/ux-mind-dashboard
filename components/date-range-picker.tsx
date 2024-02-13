'use client';

import type {
  ReactDatePickerCustomHeaderProps,
  ReactDatePickerProps,
} from 'react-datepicker';
import ReactDatePicker from 'react-datepicker';

import type {
  FieldValues,
  FieldErrors,
  Path,
  UseControllerProps,
} from 'react-hook-form';
import { useController } from 'react-hook-form';

import { format } from 'date-fns';

import { Label } from '@/components/ui/label';

import 'react-datepicker/dist/react-datepicker.css';

type Props<T extends FieldValues> = Omit<UseControllerProps<T>, 'name'> &
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
  return (
    <div className="flex justify-between px-2">
      <button
        onClick={(event) => {
          event.preventDefault();

          props.decreaseMonth();
        }}
        disabled={props.prevMonthButtonDisabled}
        className="text-xl disabled:cursor-not-allowed"
        title="Previous month"
      >
        {'<'}
      </button>
      <span>{format(props.date, 'MMMM')}</span>
      <button
        onClick={(event) => {
          event.preventDefault();

          props.increaseMonth();
        }}
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

  return (
    <div className="flex flex-col gap-2">
      <Label>{`${label}${rest.required ? '*' : ''}`}</Label>
      <ReactDatePicker
        selected={startController.field.value as Date}
        startDate={startController.field.value as Date}
        endDate={endController.field.value as Date}
        selectsRange
        inline
        renderCustomHeader={CustomHeader}
        showPreviousMonths={false}
        onChange={([start, end]: [Date, Date]) => {
          startController.field.onChange(start);
          startController.field.onBlur();

          endController.field.onChange(end);
          endController.field.onBlur();
        }}
        {...rest}
      />
    </div>
  );
}

export default DateRangePicker;
