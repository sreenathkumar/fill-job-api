import { z } from 'zod'

const allowedEmailProvider = ['gmail.com', 'protonmail.com', 'outlook.com', 'yahoo.com']

export const signupSchema = z.object({
    username: z.string().email().refine((email) => {
        const domain = email.split('@')[1];
        return allowedEmailProvider.includes(domain)
    }, {
        message: `Email must be from one of: ${allowedEmailProvider.join(", ")}`
    }),
    password: z.string().min(8, 'Password must be at least eight characters')
});


export const loginSchema = z.object({
    username: z.string().email().refine((email) => {
        const domain = email.split('@')[1];
        return allowedEmailProvider.includes(domain)
    }, {
        message: 'Invalid email.'
    }),
    password: z.string().min(8, 'Password must be at least eight characters')
});

export type SignupInput = z.infer<typeof signupSchema>;
export type LoginInput = z.infer<typeof loginSchema>;