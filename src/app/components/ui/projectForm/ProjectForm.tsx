"use client";
import Button from '../button';
import Input from '../input';
import useZodForm from '../../../hooks/useZodForm';
//import { useContext } from 'react';
import { z } from 'zod';
import { addProject } from '../../../actions/actions';
import { useRouter } from 'next/navigation';
//import init from 'zod-empty';
//import ErrorContext from '../../../state/error/error.context';
//import ErrorProvider from '../../../state/error/error.provider';

export const schema = z.object({
  name: z
    .string()
    .nonempty("Please enter project name"),
  upworkId: z.string(),
  hubstaffId: z.string(),
  asanaId: z.string(),
});

export default function ProjectForm() {
  //const { errorState } = useContext(ErrorContext);
  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isValid, isSubmitting, isDirty },
  } = useZodForm({
    schema,
    //defaultValues: init(schema),
    mode: 'onBlur',
  });
  const { push } = useRouter();

  const onSubmit = handleSubmit((data) => {
    addProject(data);
    push('/projects');
  });

  return (
    <form onSubmit={onSubmit} className="flex flex-col paper">
      <Input
        placeholder="Full Name"
        name="name"
        register={register}
        errors={errors}
      />
      <Input
        placeholder="Upwork id"
        name="upworkId"
        register={register}
        errors={errors}
      />
      <Input
        placeholder="Hubstaff id"
        name="hubstaffId"
        register={register}
        errors={errors}
      />
      <Input
        placeholder="Asana id"
        name="asanaId"
        register={register}
        errors={errors}
      />
      <Button type="submit" disabled={!isValid || !isDirty || isSubmitting}>
        Add project
      </Button>
      {/*errorState.map((error, index) => (
        <div key={index} className="text-danger my-4 text-center">
          <h1 className="text-lg font-bold">{error.title}</h1>
          {error.message}
        </div>
      ))*/}
    </form>
  );
}
