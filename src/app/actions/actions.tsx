'use server'
 
import { prisma } from '../../server/db';
import { revalidatePath } from 'next/cache';

interface ProjectData {
    id?: string;
    name: string;
    upworkId?: string;
    hubstaffId?: string;
    asanaId?: string;
}

export const addProject = async (data: ProjectData) => {
    if (!data.name) {
        return;
    }
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

export const editProject = async (data: ProjectData) => {
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