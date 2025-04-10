'use client'
import React, { useEffect, useState } from 'react'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { useForm } from "react-hook-form";
import { Input } from '@/components/ui/input';
import { forgetPasswordSchema } from '@/schemas/emailSchema';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { verifySchema } from '@/schemas/verifySchema';
import axios, { AxiosError } from 'axios';
import { useToast } from '@/hooks/use-toast';
import { ApiResponse } from '@/types/ApiResponse';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';





const page = () => {

    const [isOtpSent, setisOtpSent] = useState(false)
    const [isVerifyOtp, setisVerifyOtp] = useState(false)
    const [isVerifyingUser, setisVerifyingUser] = useState(false)
    const [username, setusername] = useState('')
    const router = useRouter()
    const { toast } = useToast()

    
    useEffect(() => {
      setisOtpSent(false)
      setusername('')
    }, [])
    
    

    const onSubmit = async(data: z.infer<typeof forgetPasswordSchema>) => {
        try {
            setusername(data.username)
            setisVerifyingUser(true)
            const response = await axios.post('/api/forget-password',{
                username : data.username,
                email : data.email
            })
            toast({
                title : response?.data.success ? "Success" : "Failed",
                description : response?.data.message,
                variant : response.data.success ? 'default' : 'destructive'
            })
            if(response.data.success){
                setisOtpSent(true)
            }

        } catch (error) {
            console.log("Error in Sending the OTP");
                  const axiosError = error as AxiosError<ApiResponse>;
                  toast({             
                    title: "Error in Sending the OTP to the User",
                    description: axiosError.response?.data.message || "",
                    variant: "destructive",
                  });
                  setisOtpSent(false)
                  setusername('')
        }
        finally{
            setisVerifyingUser(false)
        }
      
    }

    const verifyCode = async(data: z.infer<typeof verifySchema>) => {
        try {
            setisVerifyOtp(true)
            const response = await axios.post('/api/verify-code',{
                username,
                code : data.code
            })
            toast({
                title : response.data.success ? "Success" : "Failed",
                description : response.data.message,
                variant : response.data.success ? "default" : 'destructive'
            })
            if(response.data.success){
                router.replace(`/reset-password/${username}`)
            } 
        } catch (error) {
            console.log("Error in Sending the OTP");
                  const axiosError = error as AxiosError<ApiResponse>;
                  toast({
                    variant: "destructive",
                    title: 'Failed to verify the User',
                    description: axiosError.response?.data.message || "",
                  });
        }finally{
            setisVerifyOtp(false)
        }
    }

    const form = useForm<z.infer<typeof forgetPasswordSchema>>({
        resolver : zodResolver(forgetPasswordSchema),
        defaultValues : {
            username : '',
            email : ''
        }
    })

    const form2 = useForm<z.infer<typeof verifySchema>>({
        resolver : zodResolver(verifySchema),
        defaultValues : {
            code : ''
        }
    })

    const {register, handleSubmit} = form

  return (
    <div className='py-12 flex justify-center items-start min-h-screen bg-gray-50 px-4'>
        <div className='w-full max-w-2xl bg-white rounded-2xl shadow-md p-6 md:p-10'>
            <Form {...form}>
                <form onSubmit={handleSubmit(onSubmit)}>
                    
                <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700">Enter your Username</FormLabel>
                  <FormControl>
                    <Input disabled={isOtpSent}
                      placeholder="Enter your Username here..."
                      {...field}
                      onChange={(e) => field.onChange(e)}
                      className="h-12"
                    />
                  </FormControl>
                  
                  <FormMessage />
                </FormItem>
              )}
            />
                <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700 ">Enter your Email-ID</FormLabel>
                  <FormControl>
                    <Input disabled={isOtpSent}
                      placeholder="Enter your Email-ID..."
                      {...field}
                      onChange={(e) => field.onChange(e)}
                      className="h-12 "
                    />
                  </FormControl>
                  
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className='text-center'>
               {isVerifyingUser ? (
                <Loader2 className='animate-spin my-5  mx-auto'/>
            ) : (
                <Button type='submit' className='my-5 mx-2'>Get OTP</Button>
               )} 
            </div>
            
                </form>
            </Form>
           {isOtpSent && (
                 <Form {...form2}>
                 <form onSubmit={form2.handleSubmit(verifyCode)}>
                 <FormField
               control={form2.control}
               name="code"
               render={({ field }) => (
                 <FormItem>
                   <FormLabel className="text-gray-700">Enter Verification Code</FormLabel>
                   <FormControl>
                     <Input type='number'
                       placeholder="Enter Verification Code Sent to your E-Mail-ID"
                       {...field}
                       onChange={(e) => field.onChange(e)}
                       className="appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:m-0 [&::-webkit-outer-spin-button]:m-0 h-12"
                     />
                   </FormControl>
                   
                   <FormMessage />
                 </FormItem>
               )}
             />
              
             <div className='text-center'>
                {
                    isVerifyOtp ? (
                        <Loader2 className='animate-spin my-5 mx-2 w-full'/>
                    ) : (
                        <Button type='submit' className='my-5 mx-2 w-full'>Verify</Button>
                    )
                }
                 
             </div>
             
                 </form>
             </Form>
           )}
            
        </div>
    </div>
  )
}

export default page
