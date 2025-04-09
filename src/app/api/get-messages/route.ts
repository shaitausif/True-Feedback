// This file is to get all the messages
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import userModel from "@/model/User";
import {User} from 'next-auth'
import mongoose from "mongoose";

export async function GET(request : Request){
    await dbConnect()

     // First work is to get the currently logged in user
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
     
    // we can't use this userId in mongodb's aggregation pipeline it will cause an error to use it there we'll convert this into mongoose objectId
    //  const userId = user._id

    const userId = new mongoose.Types.ObjectId(user._id)
    
    try {
        // there's an aggregation pipeline $unwind which is specially for arrays so it'll open the arrays and convert the whole object into multiple documents according to the number of User
        const user = await userModel.aggregate([
            // match the UserID
            { $match : { _id : userId }},
            // unwind the array and create multiple documents of the same user with different message
            { $unwind : '$messages' },
            // Now i can perform sorting operations on it
            { $sort : {'messages.createdAt' : -1}},
            // Now let's group them all together by id
            { $group : {_id : '$_id', messages : { $push : '$messages'}}}
        ])

  

        if(!user){
            return Response.json(
                {
                    success : false,
                    message : 'User not found'
                },{status : 401}
            )
        }

        return Response.json(
            {
                success : true,
                // From the aggregation pipeline we get an array and the first object of that array contains the userId and all the sorted messages by date
                messages : user[0]?.messages
            },{status : 200}
        )

    } catch (error) {
        console.log(error)
        return Response.json(
            {
                success : false,
                messages : 'Error in getting the messages'
            },{status : 500}
        )
    }

}