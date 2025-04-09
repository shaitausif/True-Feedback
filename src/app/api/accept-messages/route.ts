import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import userModel from "@/model/User";
import {User} from 'next-auth'


// This file contains the code which will allow the user to toggle the accept messages button and it's the backend logic for it
// It's the post request to change the accept messages status of a User
export async function POST(request : Request){
    await dbConnect()

    // first work is to get the currently logged in user
    const session = await getServerSession(authOptions)
    const user: User = session?.user as User
    
    if(!session || !session.user){
        return Response.json(
            {
                success : false,
                message : 'Not Authenticated'
            }, {status : 401}
        )
    }

    const userId = user._id
    const {acceptMessages} = await request.json()

    try {
        const updatedUser = await userModel.findByIdAndUpdate(
            // It will search for this userId
            userId,
            // 2nd parameter will run after the userId found in the database to update anything
            {isAcceptingMessage : acceptMessages},
            // The third parameter will be to return the updated value
            {new : true}
        )

        if(!updatedUser){
            return Response.json(
                {
                    success : false,
                    message : "Failed to update user status to accept messages"
                }, {status : 401}
            )
        }
        return Response.json(
            {
                success : true,
                message : "Message Acceptance status updated successfully.",
                updatedUser
            }, {status : 200}
        )

    } catch (error) {
        console.log("Failed to update the User status of accept messages")
        return Response.json(
            {
                success : false,
                message : "Failed to update the User status of accept messages"
            }, {status : 500}
        )
    }


}

// here in GET we'll send the status 
export async function GET(request : Request){
    await dbConnect()

     // first work is to get the currently logged in user
     const session = await getServerSession(authOptions)
     const user: User = session?.user as User
     
     if(!session || !session.user){
         return Response.json(
             {
                 success : false,
                 message : 'Not Authenticated'
             }, {status : 401}
         )
     }
 
     const userId = user._id
    //  find user with the userid

    
   try {
    const foundUser = await userModel.findById(userId)

    if(!foundUser){
        return Response.json(
            {
                success : false,
                message : "User not found"
            },{status : 404}
        )
    }
    return Response.json(
        {
            success : true,
            isAcceptingMessages : foundUser.isAcceptingMessage
        },{status : 200}
    )
   } catch (error) {
    return Response.json(
        {
            success : true,
            message: "Error in getting the status"
        },{status : 500}
    )
   }


}