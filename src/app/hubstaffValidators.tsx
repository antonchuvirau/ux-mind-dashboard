import { z } from 'zod';

export const paginationSchema = z.object({
  next_page_start_id: z.number().optional(),
}).passthrough().optional();

export const projectSchema = z.object({
  id: z.number(),
  name: z.string(),
  status: z.string(),
}).passthrough();
export type HubstaffProject = z.infer<typeof projectSchema>;

export const userSchema = z.object({
  id: z.number(),
  name: z.string(),
  email: z.string(),
  status: z.string(),
}).passthrough();
export type HubstaffUser = z.infer<typeof userSchema>;
