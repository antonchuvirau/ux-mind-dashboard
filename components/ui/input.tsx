import _ from 'lodash';
import { type InputHTMLAttributes } from 'react';
import type {
  FieldError,
  FieldErrors,
  FieldValues,
  Path,
  UseFormRegister,
} from 'react-hook-form';

import Label from '@/components/ui/label';

type Props<T extends FieldValues> = InputHTMLAttributes<HTMLInputElement> & {
  name: Path<T>;
  label?: string;
  register: UseFormRegister<T>;
  errors: FieldErrors<T>;
  inputClassName?: string;
};

/// This is react-hook-form compatible version of Input
export default function Input<T extends FieldValues>({
  name,
  label,
  register,
  errors,
  className = 'mb-4',
  inputClassName = '',
  required,
  ...rest
}: Props<T>) {
  const error = _.get(errors, name) as FieldError | undefined;
  const labelName = label ?? String(name);

  return (
    <fieldset className={`flex flex-col ${className}`}>
      {labelName && <Label name={labelName} required={required} />}
      <input
        id={name}
        className={`
          focus:ring-secondary w-full rounded-lg border-[1px] border-[#005F730D]
          bg-[#F9FBFD] p-5 text-gray-500 placeholder:text-gray-400 focus:ring-2 disabled:cursor-not-allowed disabled:text-gray-400 ${inputClassName}
        `}
        type={rest.type}
        {...register(name, {
          valueAsNumber: rest.type === 'number',
          required,
        })}
        {...rest}
      />
      {error?.message && (
        <p className="mx-1 text-sm text-red-500">{error.message}</p>
      )}
    </fieldset>
  );
}
