import _ from 'lodash';

import Spinner from './spinner';

interface Props {
  name: string;
  required?: boolean;
  isLoading?: boolean;
}

const Label = ({ name, isLoading = false, required = false }: Props) => {
  return (
    <label
      className='text-secondary my-1 flex justify-between gap-1'
      htmlFor={name}
    >
      <span>
        {_.startCase(_.last(name.split('.'))) + (required ? '*' : '')}
      </span>
      <div>{isLoading && <Spinner className='h-4 w-4' />}</div>
    </label>
  );
};

export default Label;
