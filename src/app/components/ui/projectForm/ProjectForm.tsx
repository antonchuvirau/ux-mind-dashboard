"use client";
import Button from '../button';
import Input from '../input';
import useZodForm from '../../../hooks/useZodForm';
import { z } from 'zod';
import { addProject, editProject } from '../../../actions/actions';
import { useRouter } from 'next/navigation';
import { type Project } from '@prisma/client';

interface Props {
  project?: Project;
}

export const schema = z.object({
  name: z
    .string()
    .nonempty("Please enter project name"),
  upworkId: z.string(),
  hubstaffId: z.string(),
  asanaId: z.string(),
});

export default function ProjectForm({ project }: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isSubmitting, isDirty },
  } = useZodForm({
    schema,
    //defaultValues: init(schema),
    mode: 'onBlur',
  });
  const router = useRouter();
  const onSubmit = handleSubmit((data) => {
    if (project) {
      const modifiedData = {
        ...data,
        id: project?.id,
      }
      editProject(modifiedData)
      .catch(err => console.error('project edit error'))
      .then(() => console.log('successfully edited'))
      . catch(() => console.log('promise catched'));
    } else{
      addProject(data)
      .catch(err => console.error('project add error'))
      .then(() => console.log('successfully added'))
      .catch(() => console.log('promise catched'));
    }
    router.push('/projects');
  });

  return (
    <form onSubmit={onSubmit} className="flex flex-col paper">
      <Input
        placeholder="Full Name"
        name="name"
        defaultValue={project?.name ? project.name : ""}
        register={register}
        errors={errors}
      />
      <Input
        placeholder="Upwork id"
        name="upworkId"
        defaultValue={project?.upworkId ? project.upworkId : ""}
        register={register}
        errors={errors}
      />
      <Input
        placeholder="Hubstaff id"
        name="hubstaffId"
        defaultValue={project?.hubstaffId ? project.hubstaffId : ""}
        register={register}
        errors={errors}
      />
      <Input
        placeholder="Asana id"
        name="asanaId"
        defaultValue={project?.asanaId ? project.asanaId : ""}
        register={register}
        errors={errors}
      />
      <Button type="submit" disabled={!isValid || !isDirty || isSubmitting}>
        {project
        ? "Edit project"
        : "Add project"}
      </Button>
    </form>
  );
}