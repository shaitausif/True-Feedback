import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";
import dbConnect from "@/lib/dbConnect";
import userModel from "@/model/User";

export async function  POST(req: Request){
    await dbConnect()

    try {
        // Taking requests from the front-end
        const { username, email } = await req.json()


        // Search for the verified User by usrname in the database
        const existingUserVerifiedByUsername = await userModel.findOne({
            username,
            email,
            isVerified : true
        })

        const verificationCode = Math.floor(100000 + Math.random() * 900000).toString()
        if(existingUserVerifiedByUsername){
            existingUserVerifiedByUsername.verifyCode = verificationCode
            existingUserVerifiedByUsername.verifyCodeExpiry = new Date(Date.now() + 3600000)
            await existingUserVerifiedByUsername.save()

            const emailResponse = await sendVerificationEmail(
                email,
                username,
                verificationCode
            )
            // In the console we'll get emailResponse.success which contains the status of success

            if(!emailResponse.success){
                return Response.json({
                    success: false,
                    message : emailResponse.message
                },{status: 500})
            }
            return Response.json({
                success: true,
                message : 'Verification Code has been sent to your Email-ID, Please verify!'
            },{status: 200})

        }
        return Response.json(
            {
                success : false,
                message : 'User not found'
            }, {status : 404}
        )

    } catch (error) {
        return Response.json(
            {
                success : false,
                message : 'Error in Sending the OTP'
            },
            {
                status: 500
            }
        )
    }
}