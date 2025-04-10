import dbConnect from "@/lib/dbConnect";
import userModel from "@/model/User";
import bcrypt from "bcryptjs";

export async function POST(req: Request){
    await dbConnect()

    try {
        const { username , password } = await req.json()

        const foundUser = await userModel.findOne({
            username,
            isVerified : true
        })

        if(foundUser){
            const hashedPassword = bcrypt.hash(password, 10)

            foundUser.password = await hashedPassword
            foundUser.save()
            return Response.json(
                {
                    success : true,
                    message : "User Password updated successfully."
                },{status : 200}
            )
        }

        return Response.json({
            success : false,
            message : "User not found"
        },{status : 404}
    )

    } catch (error) {
        return Response.json(
            {
                success : false,
                message : "Error in Setting new Password"
            },{status : 500}
        )
    }
}