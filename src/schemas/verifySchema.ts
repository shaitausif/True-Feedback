import { z } from 'zod'

// this is the schema for validation of the verification code 
// we also did something like this in mongodb but that's only for the data which goes to database 
export const verifySchema = z.object({
    code : z.string().length(6,'Verification code must be 6 digits').regex(/^\d{6}$/, "Code must be 6 digits")
})