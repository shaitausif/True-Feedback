import {z} from 'zod'

export const passwordSchema = z.object({
    password : z.string().min(8,{message : 'Password must be atleast of 8 characters'})
        .max(20, 'Password must be less than 20 characters'),
    confirmPassword : z.string().min(8,{message : 'Password must be atleast of 8 characters'})
        .max(20, 'Password must be less than 20 characters'),
})