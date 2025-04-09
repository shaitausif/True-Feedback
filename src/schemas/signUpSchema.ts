// ✅ Mongoose vs. Zod (Key Differences)
// - Mongoose: Defines schemas & validates data before storing in MongoDB.
// - Zod: Validates data at runtime (e.g., API requests) before sending to the database.
// - Use Zod for API input validation & Mongoose for database schema enforcement.
import { z } from 'zod'

export const usernamValidation = z
.string()
.min(2,'Username must be atleast of 2 characters')
.max(20, 'Username should not be more than 20 characters')
.regex(/^[a-zA-Z0-9]+$/
,'Username must not contain special characters')

export const signUpSchema = z.object({
    username : usernamValidation,
    email : z.string().email({message : 'Invalid email address'}),
    password : z.string().min(8,{message : 'Password must be atleast of 8 characters'})
    .max(20, 'Password must be less than 20 characters')
})
