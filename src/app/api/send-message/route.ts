// In this file we'll allow the user to send the messages or feedback to a verified user and anyone can give messages without any need to logging in
import userModel from "@/model/User";
import dbConnect from "@/lib/dbConnect";
import { Message } from "@/model/User";

export async function POST(request : Request){
    await dbConnect()

    const {username, content} = await request.json()

    try {
        const user = await userModel.findOne({username})

        if(!user){
            return Response.json(       
                {
                    success : false,
                    message : 'User not found'
                },{ status : 404 }
            )
        }
        
        // Check if the user is accepting the messages or not
        if(!user.isAcceptingMessage){
            return Response.json(
                {
                    success : false,
                    message : "User is not accepting the messages"
                },{status : 403}
            )
        }

        const newMessage  = {content, createdAt : new Date() }
        // Now, push this new message into the messages array of the user

        user.messages.push(newMessage as Message)
        await user.save()

        return Response.json(
            {
                success: true,
                message : 'Message Sent Successfully'
            }, {status : 200}
        )

    } catch (error) {
        console.log(error)
        return Response.json(
            {
                success: false,
                message : 'Error adding messages'
            }, {status : 500}
        )
    }
}