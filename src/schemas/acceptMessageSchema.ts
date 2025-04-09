// here we just have to work for only one single boolean value
import { z } from 'zod'

export const acceptMessageSchema = z.object({
    acceptMessages : z.boolean()
})