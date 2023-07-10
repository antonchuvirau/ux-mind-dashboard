import { type Activity } from '@app-masters/hubstaff-node-client/dist/types';
import { revalidatePath } from 'next/cache';

interface Props {
  activities: Activity[];
}

const projects = [
  "Проект 1"
];

const addProjectForm = () => {
  const addProject = async (form: FormData) => {
    'use server';
    const project = form.get("project-name")?.toString();
    if (!project) {
      return;
    }
    //await saveToDb({ cartId, data })
    revalidatePath("/");
  }
  return (
    <>
      <form action={addProject}>
        <input placeholder="Название проекта" name="project-name" />
        <button>Добавить</button>
      </form>
    </>
  );
};

export default addProjectForm;