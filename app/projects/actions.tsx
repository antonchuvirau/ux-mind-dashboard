'use server';

import { revalidatePath } from 'next/cache';
import { type z } from 'zod';

import { type schema } from '@/components/ui/project-form';
import { prisma } from '@/lib/db';

type Project = z.infer<typeof schema>;

export const addProject = async (data: Project) => {
  await prisma.project.create({
    data: {
      name: data.name,
      upworkId: data.upworkId,
      hubstaffId: data.hubstaffId,
      asanaId: data.asanaId,
    },
  });

  revalidatePath('/projects');
};

export const editProject = async (data: Project) => {
  if (!data.name) {
    return;
  }

  await prisma.project.update({
    where: {
      id: data.id,
    },
    data: {
      name: data.name,
      upworkId: data.upworkId,
      hubstaffId: data.hubstaffId,
      asanaId: data.asanaId,
    },
  });

  revalidatePath('/projects');
};
