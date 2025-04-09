// here we're defining a validation schema for signing in the use
import { z } from 'zod'
import {usernamValidation} from '@/schemas/signUpSchema'

export const signInSchema = z.object({
    // identifier is email
    identifier: z.string().min(3).max(50),
    password : z.string()
})