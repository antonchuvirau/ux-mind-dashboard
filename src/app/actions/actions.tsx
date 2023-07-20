'use server'
 
import { prisma } from '../../server/db';
import { revalidatePath } from 'next/cache';
import { type Project } from '@prisma/client';

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
            id: data.id
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