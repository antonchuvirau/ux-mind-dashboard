'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

import { action } from '@/lib/safe-action';
import { prisma } from '@/lib/db';

const schema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, { message: 'Please enter project name' }),
  upworkId: z.string().nullable(),
  hubstaffId: z.string().nullable(),
  asanaId: z.string().nullable(),
});

export const addProject = action(schema, async (data) => {
  try {
    await prisma.project.create({
      data: {
        name: data.name,
        upworkId: data.upworkId,
        hubstaffId: data.hubstaffId,
        asanaId: data.asanaId,
      },
    });
  } catch (e) {
    console.log(e);

    return { failure: 'Error occured while adding the project!' };
  }

  // https://github.com/vercel/next.js/issues/49298#issuecomment-1542055642
  revalidatePath('/projects', 'page');
  redirect('/projects');
});

export const editProject = action(schema, async (data) => {
  try {
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
  } catch (e) {
    console.log(e);

    return { failure: 'Error occured while updating the project!' };
  }

  // https://github.com/vercel/next.js/issues/49298#issuecomment-1542055642
  revalidatePath('/projects', 'page');
  redirect('/projects');
});
