// This file is to get all the messages
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import userModel from "@/model/User";
import {User} from 'next-auth'
import { NextRequest } from 'next/server';

export async function DELETE(
  req: NextRequest,
  { params }: { params: { messageid: string } }
) {
  const messageID = params.messageid;
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

    try {
        // The whole document is going inside the messages array of userModel as we've created a messageSchema so we'll get an unique _id for each user for each message of messages array seperately 
        const updatedResult = await userModel.updateOne(
            {_id : user._id},
            // learn more about $pull from mongodb's document
            { $pull : {messages : {_id : messageID}}}
        )

        if(updatedResult.modifiedCount == 0){
            return Response.json(
                {
                    success : false,
                    message : 'Message not found or already deleted'
                },{status : 404}
            )
        }

        return Response.json(
            {
                success : true,
                message : 'Message Deleted'
            },{status : 200}
        )
    } catch (error) {
        return Response.json(
            {
                success : false,
                message : 'Error in Deleting Message'
            },{status : 500}
        )
    }
}
