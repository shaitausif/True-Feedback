import { z } from "zod";
import { usernamValidation } from "./signUpSchema";

export const forgetPasswordSchema = z.object({
    username: usernamValidation,
    email : z.string().email({message : 'Invalid email address'}),
})