import { z } from 'zod';

export const formSchema = z
	.object({
		name: z
			.string()
			.min(3, 'Username must be at least 3 characters')
			.max(20, 'Username cannot exceed 20 characters'),
		email: z.string().email('Please enter a valid email'),
		password: z
			.string()
			.min(8, 'Password must be at least 8 characters')
			.regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
			.regex(/[0-9]/, 'Password must contain at least one number'),
		confirmPassword: z.string(),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "Passwords don't match",
		path: ['confirmPassword'],
	});
