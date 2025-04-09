import { authOptions } from "./options";
import NextAuth from "next-auth";


// it's necessary for this method to be named as handler
const handler = NextAuth(authOptions)

// These files only work with the verbs like POST and GET
export {handler as GET, handler as POST}