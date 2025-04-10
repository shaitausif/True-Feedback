'use client'

import { Button } from '@/components/ui/button'
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useToast } from '@/hooks/use-toast'
import { verifySchema } from '@/schemas/verifySchema'
import { ApiResponse } from '@/types/ApiResponse'
import { zodResolver } from '@hookform/resolvers/zod'
import axios, { AxiosError } from 'axios'
import { useParams, useRouter } from 'next/navigation'
import React, { useState } from 'react'
import {  useForm } from 'react-hook-form'
import { Form } from '@/components/ui/form'
import * as z from 'zod'
import { Loader2 } from 'lucide-react'

const page = () => {
    const router = useRouter()
    const params = useParams()
    const {toast} = useToast()
    const [isVerifying, setisVerifying] = useState(false)

      // https://www.react-hook-form.com/get-started
      // here we're giving surity that the value given by resolver will the verifySchema
      const form = useForm<z.infer<typeof verifySchema>>({
        resolver: zodResolver(verifySchema),
        defaultValues : {
            code : ''
        }
        
      });

      const onSubmit = async(data : z.infer<typeof verifySchema>) => {
        try {
            setisVerifying(true)
            const response = await axios.post('/api/verify-code', {
                username: params.username,
                code : data.code
            })
            console.log('hi')
            toast({
                title : response.data.success ? "Success" : "Failed",
                description : response.data.message
            })
            if(response.data.success){
                router.replace('/sign-in')
            }
            
        } catch (error) {
            console.log("Error in Sign up of the User.");
                  const axiosError = error as AxiosError<ApiResponse>;
                  toast({
                    variant: "destructive",
                    title: "Error in Signing Up the User",
                    description: axiosError.response?.data.message || "",
                  });
        }
        finally{
          setisVerifying(false)
        }
      }

  return (
    <div className='flex justify-center items-center min-h-screen bg-gray-100'>
      <div className='w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md'>
            <div className='text-center'>
            <h2 className="text-4xl font-bold tracking-tight lg:text-5xl mb-6">
            Verify Your Account
          </h2>
          <p className="mb-4">Enter the verification code sent to your Email</p>
            </div>
            <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="code"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Verification Code</FormLabel>
              <FormControl>
                <Input className="appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:m-0 [&::-webkit-outer-spin-button]:m-0" type='number' placeholder="code" {...field} />
              </FormControl>  
             
              <FormMessage />
            </FormItem>
          )}
        />
        <Button disabled={isVerifying} type="submit">{isVerifying && (
          <>         
          <Loader2/>
          <p className='px-2'>Please Wait</p>
          </>
      )}  {!isVerifying && "Verify"}</Button>
      </form>
    </Form>
      </div>
    </div>
  )
}

export default page
