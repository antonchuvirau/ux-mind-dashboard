'use client';

import { useTransition } from 'react';
import { useAction } from 'next-safe-action/hooks';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

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
      className="flex flex-col gap-7"
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
      <div className="grid gap-2">
        <Label htmlFor="fullname">Project name</Label>
        <Input id="fullname" placeholder="Project name" {...register('name')} />
        {errors?.name && (
          <p className="px-1 text-sm text-red-600">{errors.name.message}</p>
        )}
      </div>
      <div className="grid gap-2">
        <Label htmlFor="upworkId">Upwork Id</Label>
        <Input
          id="upworkId"
          placeholder="Upwork Id"
          {...register('upworkId')}
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="hubstaffId">Hubstaff Id</Label>
        <Input
          id="hubstaffId"
          placeholder="Hubstaff Id"
          {...register('hubstaffId')}
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="asanaId">Asana Id</Label>
        <Input id="asanaId" placeholder="Asans Id" {...register('asanaId')} />
      </div>
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
            : 'Edit'
          : addStatus === 'executing' || isPending
            ? 'Loading...'
            : 'Add'}
      </Button>
    </form>
  );
}
