import React, { FC, ReactNode, useState } from 'react';
import { IErrorStateType } from '../../utils';
import ErrorContext from './error.context';

interface Props {
  children?: ReactNode;
}
export const ErrorProvider: FC<Props> = (props) => {
  const [errorState, setErrorState] = useState<Array<IErrorStateType>>([]);

  const value = {
    errorState,
    setErrorState,
  };

  return (
    <ErrorContext.Provider value={value}>
      {props.children}
    </ErrorContext.Provider>
  );
};

export default ErrorProvider;
