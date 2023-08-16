import { FC } from 'react';
import _ from 'lodash';

interface Props {
  name: string;
  required?: boolean;
}

const Label: FC<Props> = ({ name, required = false }) => {
  return (
    <label className="text-sm text-primary my-1 mx-3" htmlFor={name}>
      {_.startCase(_.last(name.split('.'))) + (required ? '*' : '')}
    </label>
  )
}

export default Label;