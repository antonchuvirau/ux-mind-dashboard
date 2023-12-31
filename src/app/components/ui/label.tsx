import { type FC } from 'react';
import _ from 'lodash';
import Spinner from './spinner';

interface Props {
  name: string;
  required?: boolean;
  isLoading?: boolean;
}

const Label: FC<Props> = ({ name, isLoading = false, required = false }) => {
  return (
    <label
      className="text-secondary my-1 flex justify-between gap-1"
      htmlFor={name}
    >
      <span>
        {_.startCase(_.last(name.split('.'))) + (required ? '*' : '')}
      </span>
      <div>{isLoading && <Spinner className="w-4 h-4" />}</div>
    </label>
  );
};

export default Label;