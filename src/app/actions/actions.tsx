'use server'
 
import { prisma } from '../../server/db';
import { revalidatePath } from 'next/cache';

interface ProjectData {
    name: string;
    upworkId?: string;
    hubstaffId?: string;
    asanaId?: string;
}

export const addProject = async (data: ProjectData) => {
    const projectName = data.name;
    const upworkID = data.upworkId;
    const hubstaffId = data.hubstaffId;
    const asanaID = data.asanaId;
    if (!projectName) {
        return;
    }
    await prisma.project.create({
        data: {
        name: projectName,
        upworkId: upworkID,
        hubstaffId: hubstaffId,
        asanaId: asanaID,
        },
    });
    revalidatePath('/projects');
};