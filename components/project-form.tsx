'use client';

import { useTransition } from 'react';
import { useAction } from 'next-safe-action/hooks';
import { z } from 'zod';

import Button from '@/components/button';
import Input from '@/components/input';

import { useZodForm } from '@/hooks/use-zod-form';

import { addProject, editProject } from '@/app/projects/actions';

import { type Project } from '@prisma/client';

interface Props {
  defaultValues?: Project;
}

const schema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, { message: 'Please enter project name' }),
  upworkId: z.string().nullable(),
  hubstaffId: z.string().nullable(),
  asanaId: z.string().nullable(),
});

export default function AddProjectForm({ defaultValues }: Props) {
  const [isPending, startTransition] = useTransition();

  const { execute: executeAdd, status: addStatus } = useAction(addProject, {
    onSuccess: (data) => {
      if (data && 'failure' in data) {
        console.log(data.failure);
        return;
      }

      console.log('Project was successfully added'); // fix: won't be printed
    },
  });

  const { execute: executeEdit, status: editStatus } = useAction(editProject, {
    onSuccess: (data) => {
      if (data && 'failure' in data) {
        console.log(data.failure);
        return;
      }

      console.log('Project was successfully edited'); // fix: won't be printed
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isSubmitting, isDirty },
  } = useZodForm({
    schema,
    mode: 'onBlur',
    defaultValues: defaultValues || {
      name: '',
      upworkId: '',
      hubstaffId: '',
      asanaId: '',
    },
  });

  return (
    <form
      className="flex flex-col"
      onSubmit={handleSubmit((data) => {
        if (defaultValues) {
          const modifiedData = {
            ...data,
            id: defaultValues?.id,
          };

          startTransition(() => {
            executeEdit(modifiedData);
          });
        } else {
          startTransition(() => {
            executeAdd(data);
          });
        }
      })}
    >
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
      <Button
        type="submit"
        disabled={
          !isValid ||
          !isDirty ||
          isSubmitting ||
          addStatus === 'executing' ||
          isPending
        }
      >
        {defaultValues
          ? editStatus === 'executing' || isPending
            ? 'Loading...'
            : 'Edit project'
          : addStatus === 'executing' || isPending
            ? 'Loading...'
            : 'Add project'}
      </Button>
    </form>
  );
}
