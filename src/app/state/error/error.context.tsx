"use client";
import { createContext } from 'react';
import { IErrorContextType } from '../../utils';

const ErrorContext = createContext<IErrorContextType>({
  setErrorState: console.log,
  errorState: [],
});

export default ErrorContext;
