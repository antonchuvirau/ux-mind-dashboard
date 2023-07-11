import { prisma } from '../../server/db';
import { revalidatePath } from 'next/cache';
export default function Form() {
    const addProject = async (form: FormData) => {
        'use server';
        const projectName = form.get("project-name")?.toString();
        const upworkID = form.get("upwork-id")?.toString();
        const hubstaffId = form.get("hubstaff-id")?.toString();
        const asanaID = form.get("asana-id")?.toString();
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
        revalidatePath("/");
    }
    return (
        <main className="container mx-auto py-10">
            <div className="text-primary mb-2 mt-0 text-5xl font-medium leading-tight">
                Add project
            </div>
            <form action={addProject} className="w-80 mt-">
                <input className="block p-2 h-16 border-solid border-2 border-black rounded-xl mb-8 w-full" placeholder="Название проекта" name="project-name" />
                <input className="block p-2 h-16 border-solid border-2 border-black rounded-xl mb-8 w-full" placeholder="Upwork ID" name="upwork-id" />
                <input className="block p-2 h-16 border-solid border-2 border-black rounded-xl mb-8 w-full" placeholder="Hubstaff ID" name="hubstaff-id" />
                <input className="block p-2 h-16 border-solid border-2 border-black rounded-xl mb-8 w-full" placeholder="Asana ID" name="asana-id" />
                <button className="block p-2 h-16 border-solid border-2 border-black rounded-xl mb-8 bg-black text-white w-full">
                    Добавить
                </button>
            </form>
        </main>
    );
}