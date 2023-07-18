export interface IErrorStateType {
  title: string;
  message: string;
  id?: number;
  closed?: boolean;
}

export interface IErrorContextType {
  setErrorState: React.Dispatch<React.SetStateAction<Array<IErrorStateType>>>;
  errorState: Array<IErrorStateType>;
}

export interface ErrorProps {
  errorState: Array<IErrorStateType>;
  showError: (data: IErrorStateType) => void;
  setErrorState: React.Dispatch<React.SetStateAction<Array<IErrorStateType>>>;
}
