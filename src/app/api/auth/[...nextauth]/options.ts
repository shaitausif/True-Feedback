// Here we'll write all the options for sign in providers
// Here we're using next auth to create authentication for sign in page we could had create the same for sign up page but we chose to create our custom logic for sign-up authentication but here for sign in we're using next-auth for authentication just to know the diverse ways to do the things
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/dbConnect";
import userModel from "@/model/User";


// Here the next-auth will automatically generate the form for the sign in page we just need to customize it here
// For more info: https://next-auth.js.org/providers/credentials
export const authOptions : NextAuthOptions = {
    providers : [
        CredentialsProvider({
            id: 'credentials',
            name : 'Credentials',
            credentials : {
                email: { label : 'Email', type : 'text', placeholder : 'Enter your Email'},
                password :{ label : 'Password', type : 'password'}
            },
            // It's essential to use the async authorize method because next-auth doesn't know how to authorize so we've to design custom authentication
            async authorize(credentials: any): Promise<any>{
                // Search for the user by username or email id in the database
                await dbConnect()
                try {
                    const user = await userModel.findOne({
                        // this $or is mongodb operator which works similar to a logical or
                        $or : [
                            {email: credentials.identifier},
                            {username : credentials.identifier}
                        ]
                    })
                    // if there is no user with those credentials in the db
                    if(!user){
                        throw new Error('No User Found with this email')
                    }
                    // then the condition for if the user is not verified
                    if(!user.isVerified){
                        throw new Error('Please Verify your account first before signing in')
                    }
                    // we can get the password by credentials.password it's the frontend
                    const isCorrectPassword = await bcrypt.compare(credentials.password, user.password)
                    if(isCorrectPassword){
                        // after returning the user the control goes back to the authOptions and the user object indicates that the credentials are valid
                        return user
                    }
                    else{
                        throw new Error("Incorrect Password")
                    }

                } catch (err: any) {
                    throw new Error(err)
                }
            }

        })
    ],

    // The callbacks object in NextAuthOptions allows you to customize authentication behavior by modifying session, JWT, and redirect logic. It contains functions that execute at specific points in the authentication flow.
    callbacks : {
        // The user came from the providers of the next-auth which follows User interface which says that the credentials are valid.
        // I'll try to insert maximum data of user in the token
        async jwt({ token, user }) {
            // i've modified the token here in this function
            if(user){
                // I am storing the values from the user to the token
                // token._id = user._id?.toString() to understand this goto types -> next-auth.d.ts
                token._id = user._id?.toString()
                token.isVerified = user.isVerified
                token.isAcceptingMessages = user.isAcceptingMessages;
                token.username = user.username

            }
            // it's necessary to return the token in the jwt method
            return token
          },
        async session({ session, token }) {
            session.user._id = token._id
            session.user.isVerified = token.isVerified
            session.user.isAcceptingMessages = token.isAcceptingMessages
            session.user.username = token.username

            // It's compulsory to return the session in the session method
            return session
          }
          
    },

    // Pages allows you to customize the default authentication pages by specifying your own routes.
    pages : {
        signIn : '/sign-in',
    },

    // The session object is inside callbacks in NextAuthOptions, and it lets you customize the session data before it is sent to the client.
    // A session in NextAuth.js is the authenticated user's state stored between requests. It allows users to stay logged in without needing to re-authenticate every time they make a request.
    session : {
        // Store session in a JSON Web Token(JWT)
        strategy:  'jwt'
    },
    secret : process.env.NEXTAUTH_SECRET
}