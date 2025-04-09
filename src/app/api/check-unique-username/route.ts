// Here in this file we'll check for unique username
// Means availability of the username will be checked before sending the whole data of the user to the database
import userModel from "@/model/User";
import dbConnect from "@/lib/dbConnect";
import { z } from 'zod'
import { usernamValidation } from "@/schemas/signUpSchema";

const usernameQuerySchema = z.object({
    username : usernamValidation
})

export async function GET(request : Request){
        
    await dbConnect()
    // The URL would be something like this
    // localhost:3000/api/check-unique-username?username=Tausif?and other queries......
    try{
        // Extracting url 
        const {searchParams} = new URL(request.url)
        // exctracting query parameter of username query
        const queryParam = {
            username : searchParams.get('username')
        }
        // validate with zod 
        // by using safeParse if the parsing is safe and schema is followed then you'll get the value else no value
        const result = usernameQuerySchema.safeParse(queryParam)
        console.log(result)
        // If no value was found in the result
        if(!result.success){
            const usernameErrors = result.error.format().username?._errors || []
            return Response.json(
                {
                    success : false,
                    message : usernameErrors.length > 0 ? usernameErrors.join(', ') : 'Invalid query parameters'
                }, { status : 400 }
            )
        }

        const {username} = result.data
        console.log(username)

        const existingVerifiedUser = await userModel.findOne({ username, isVerified : true })
        if(existingVerifiedUser){
            return Response.json(
                {
                    success : false,
                    message : 'Username is already taken'
                }, {status : 400}
            )
        }
        return Response.json(
            {
                success : true,
                message : 'Username is available'
            }, {status : 200}
        )

    } catch (error) {
        console.log('Error in Checking username', error)
        return Response.json(
            {
                success : false,
                message : 'Error in Checking username'
            },
            {status : 500}
        )
    }
}