import {resend} from '@/lib/resend'
import VerificationEmail from '../../emails/VerificationEmail'
import { ApiResponse } from '@/types/ApiResponse'

// Here, in this file we're sending verification email to the respective email address with exception handling
// Emails are always asynchronous
export async function sendVerificationEmail(
    email : string,
    username : string,
    verificationCode : string
): Promise<ApiResponse> {
    try {
        await resend.emails.send({
            from: 'Acme <onboarding@resend.dev>',
            to: email,
            subject: 'True Feedback | Verification Code',
            react: VerificationEmail({username, otp : verificationCode}),
          });

        return {success : true, message : 'Verification Email sent successfully.'}
    } catch (emailError) {
        console.error('Email sending error:',emailError)
        return {success : false, message : 'Failed to send Verification email'}
    }
}