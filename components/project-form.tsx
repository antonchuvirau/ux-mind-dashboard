'use client';

import { useTransition } from 'react';
import { useAction } from 'next-safe-action/hooks';
import { z } from 'zod';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

import { Icons } from '@/components/icons';

import { useZodForm } from '@/hooks/use-zod-form';

import { addProject, editProject } from '@/app/projects/actions';

import { type Project } from '@prisma/client';

interface Props {
  defaultValues?: Project;
}

const schema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, { message: 'Project name is required' }),
  upworkId: z.string().nullable(),
  hubstaffId: z.string().nullable(),
  asanaId: z.string().nullable(),
});

export default function AddProjectForm({ defaultValues }: Props) {
  const router = useRouter();

  const [isPending, startTransition] = useTransition();

  const { execute: executeAdd, status: addStatus } = useAction(addProject, {
    onSuccess: (data) => {
      if (data && 'failure' in data) {
        toast.error(data.failure);
        return;
      }

      toast.success(data.message);

      startTransition(() => {
        router.push('/projects');
      });
    },
  });

  const { execute: executeEdit, status: editStatus } = useAction(editProject, {
    onSuccess: (data) => {
      if (data && 'failure' in data) {
        toast.error(data.failure);
        return;
      }

      toast.success(data.message);

      startTransition(() => {
        router.push('/projects');
      });
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

          executeEdit(modifiedData);
        } else {
          executeAdd(data);
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
          editStatus === 'executing' ||
          isPending
        }
      >
        {defaultValues ? (
          editStatus === 'executing' || isPending ? (
            <span className="flex items-center gap-2">
              <Icons.spinner className="size-4 animate-spin" />
              <span>Saving...</span>
            </span>
          ) : (
            'Edit'
          )
        ) : addStatus === 'executing' || isPending ? (
          <span className="flex items-center gap-2">
            <Icons.spinner className="size-4 animate-spin" />
            <span>Adding...</span>
          </span>
        ) : (
          'Add'
        )}
      </Button>
    </form>
  );
}
