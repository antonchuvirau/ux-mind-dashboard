import { type ButtonHTMLAttributes } from 'react';

import Spinner from './spinner';

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  isLoading?: boolean;
  variant?: 'primary' | 'secondary';
  className?: string;
};

export default function Button({
  children,
  isLoading,
  variant = 'primary',
  className = '',
  ...rest
}: Props) {
  return (
    <button
      type='submit'
      className={`
        text-md relative flex w-full items-center
        justify-center whitespace-nowrap rounded-full bg-black
        px-12 py-3 font-bold
        uppercase
        text-white
        disabled:cursor-not-allowed
        disabled:bg-gray-400 sm:w-fit
        ${isLoading ? 'cursor-progress' : ''}
        ${variant === 'primary' ? 'bg-primary' : ''}
        ${variant === 'secondary' ? 'bg-secondary' : ''}
        ${className}
      `}
      {...rest}
    >
      {children}
      {isLoading && (
        <Spinner className='absolute bottom-0 right-2 top-0 aspect-square h-full w-6' />
      )}
    </button>
  );
}
