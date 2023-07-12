import { z } from "zod";

export const projectSchema = z.object({
  id: z.number(),
  name: z.string(),
  status: z.string(),
});
export type HubstaffProject = z.infer<typeof projectSchema>;


export const userSchema = z.object({
  id: z.number(),
  name: z.string(),
  email: z.string(),
  status: z.string(),
})
export type HubstaffUser = z.infer<typeof userSchema>;
