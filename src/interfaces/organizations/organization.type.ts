import z from 'zod';

export const OrganizationSchema = z.object({
	code: z.string(),
	name: z.string(),
}).strict();

export const CreateOrganizationSchema = OrganizationSchema;
export const UpdateOrganizationSchema = OrganizationSchema.partial();

export type Organization = z.infer<typeof OrganizationSchema>;
export type CreateOrganizationDto = Organization;
export type UpdateOrganizationDto = Partial<Organization>;
