// here we're defining a validation schema for signing in the use
import { z } from 'zod'
import {usernamValidation} from '@/schemas/signUpSchema'

export const signInSchema = z.object({
    // identifier is email
    identifier: z.string().min(3).max(50),
    password : z.string().min(8, 'Password must be atleast 8 characters').max(20,'Password should not exceed 20 characters')
})