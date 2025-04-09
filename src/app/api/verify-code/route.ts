import userModel from "@/model/User";
import dbConnect from "@/lib/dbConnect";


export async function POST(request: Request){
    // connect to the database
    await dbConnect()

    try {
        const {username, code} = await request.json()


        // Decode url
        const decodeUsername = decodeURIComponent(username)
        const user = await userModel.findOne(
            {username : decodeUsername}
        )
        if(!user){
            return Response.json(
                {
                    success : false,
                    message : 'User not found'
                }, {status : 500}
            )
        }
        // If user is found in the database then 
        // check for the code validity
        const isCodeValid = user.verifyCode === code    

        // Now check for the expiry date of the code user have
        // The user date must be greater than the current date
        const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date()

        if(isCodeValid){
            user.isVerified = true;
            await user.save()
            
            return Response.json(
                {
                    success : true,
                    message : "User Verified Successfully"
                },{status : 200}
            )
        }
        else if(!isCodeNotExpired){
            return Response.json(
                {
                    success : false,
                    message : 'Verification Code has been expired sign up again'
                },{status : 400}
            )
        }
        else{
            return Response.json(
                {
                    success : false,
                    message : "Incorrect Verification Code"
                },{status : 400}
            )
        }

    } catch (error) {
        console.log('Error in verifying code', error)
        return Response.json(
            {
                success : false,
                message : 'Error in verifying code'
            },
            {status : 500}
        )
    }
}