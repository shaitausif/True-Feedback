// Here we're handling API's to sign up the user
// As next.js runs on edge that's why the imports of database connections is required for each route
import dbConnect from "@/lib/dbConnect";
import userModel from "@/model/User";
// bcryptjs is a JavaScript library used to hash passwords securely. It is a pure JavaScript implementation of the bcrypt algorithm and is commonly used for password encryption and authentication in Node.js applications.
import bcrypt from "bcryptjs";
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";

export async function POST(request : Request){
    
    await dbConnect()

    try {
        // Taking request from the frontEnd
     
        const {username, email, password} = await request.json()
        
            

        // Search for the verified User with userName in the database
        
        const existingUserVerifiedByUsername = await userModel.findOne({
            username,
            isVerified: true
        })
        // if the usename is verified and exists in the database then we won't assign this to anyone 
        // but if the user is not verified then anyone can take that username
        if(existingUserVerifiedByUsername){
            return Response.json({
                success: false,
                message: 'User already exists'
            },{status : 400})
        }   

        // Search for the User with the same email in the database
        const existingUserByEmail = await userModel.findOne({
            email
        })
        const verificationCode = Math.floor(100000 + Math.random() * 900000).toString()
        if(existingUserByEmail){
            // If the email exist in the database
            if(existingUserByEmail.isVerified){
                return Response.json({
                    success: false,
                    message: 'User already exists with this email'
                },{status : 400})
            }
            else{
                const hashedPassword = await bcrypt.hash(password, 10)
                existingUserByEmail.password = hashedPassword;
                existingUserByEmail.verifyCode = verificationCode;
                existingUserByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000)
                await existingUserByEmail.save()
            }

        }else{
            // register a new User
            // Encrypt the Password
            const hashedPassword = await bcrypt.hash(password, 10)
            const expiryDate = new Date()
            expiryDate.setHours(expiryDate.getHours() + 1)

            // save User in the database
            const newUser = await new userModel({
                    username,
                    email,
                    password: hashedPassword,
                    verifyCode: verificationCode,
                    verifyCodeExpiry : expiryDate,
                    isVerified:  false,
                    isAcceptingMessage: true,
                    messages: []
            })

            await newUser.save()

        }

        // Send verification Email
        const emailResponse = await sendVerificationEmail(
            email,
            username,
            verificationCode,
        )
        console.log(emailResponse)
        // in console we got emailResponse.success property which contains the status of success

        if(!emailResponse.success){
            return Response.json({
                success: false,
                message : emailResponse.message
            },{status: 500})
        }
        return Response.json({
            success: true,
            message : 'User Registered Successfully. Please verify your email'
        },{status: 201})


    } catch (error) {
        // This message will be shown in the terminal
        console.error('Error in Registering the User')
        // Here we're sending this response to the FrontEnd
        return Response.json(
            {
                success : false,
                message : 'Error in registering the User'
            },
            {
                status: 500
            }
        )
    }
}