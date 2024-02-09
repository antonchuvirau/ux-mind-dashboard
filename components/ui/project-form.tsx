'use client';

import { useRouter } from 'next/navigation';
import { z } from 'zod';
import { type Project } from '@prisma/client';

import Button from '@/components/ui/button';
import Input from '@/components/ui/input';

import { useZodForm } from '@/hooks/use-zod-form';

import { addProject, editProject } from '@/actions/actions';

interface Props {
  defaultValues?: Project;
}

export const schema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, { message: 'Please enter project name' }),
  upworkId: z.string().nullable(),
  hubstaffId: z.string().nullable(),
  asanaId: z.string().nullable(),
});

export default function ProjectForm({ defaultValues }: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isSubmitting, isDirty },
  } = useZodForm({
    schema,
    defaultValues: defaultValues || {
      name: '',
      upworkId: '',
      hubstaffId: '',
      asanaId: '',
    },
    mode: 'onBlur',
  });
  const router = useRouter();

  const onSubmit = handleSubmit((data) => {
    if (defaultValues) {
      const modifiedData = {
        ...data,
        id: defaultValues?.id,
      };
      editProject(modifiedData)
        .catch(() => console.error('project edit error'))
        .then(() => console.log('successfully edited'))
        .catch(() => console.log('promise catched'));
    } else {
      addProject(data)
        .catch(() => console.error('project add error'))
        .then(() => console.log('successfully added'))
        .catch(() => console.log('promise catched'));
    }
    router.push('/projects');
  });

  return (
    <form onSubmit={onSubmit} className='paper flex flex-col'>
      <Input
        placeholder='Full Name'
        name='name'
        register={register}
        errors={errors}
      />
      <Input
        placeholder='Upwork id'
        name='upworkId'
        register={register}
        errors={errors}
      />
      <Input
        placeholder='Hubstaff id'
        name='hubstaffId'
        register={register}
        errors={errors}
      />
      <Input
        placeholder='Asana id'
        name='asanaId'
        register={register}
        errors={errors}
      />
      <Button type='submit' disabled={!isValid || !isDirty || isSubmitting}>
        {defaultValues ? 'Edit project' : 'Add project'}
      </Button>
    </form>
  );
}
