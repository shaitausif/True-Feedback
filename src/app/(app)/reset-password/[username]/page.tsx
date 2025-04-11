'use client'
import React, { useState } from 'react'
import userModel from '@/model/User'
import dbConnect from '@/lib/dbConnect'
import { useForm } from 'react-hook-form'
import { Form } from '@/components/ui/form'
import { zodResolver } from '@hookform/resolvers/zod'
import { passwordSchema } from '@/schemas/passwordSchema'
import { useParams, useRouter } from 'next/navigation'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { z } from 'zod'
import { Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'
import axios, { AxiosError } from 'axios'
import { ApiResponse } from '@/types/ApiResponse'

const page = () => {

    const params = useParams()
    const username = params.username
    const [isSubmitting, setisSubmitting] = useState(false)
    const {toast} = useToast()
    const router = useRouter()


    const onSubmit = async(data: z.infer<typeof passwordSchema>) => {
      try {
        setisSubmitting(true)
        if(data.password === data.confirmPassword){
          const response = await axios.post('/api/reset-password',{
            username,
            password : data.password
        })
        toast({
          title : response.data.success ? "Success" : "Failed",
          description : response.data.message || '',
          variant : response.data.success ? 'default' : 'destructive'
        })
        if(response.data.success){
          router.replace('/sign-in')
        }

        }
        
        else{
          toast({
          title : "Error",
          description : "Both the passwords are different",
          variant : 'destructive'
        })
        }
        
      } catch (error) {
        const axisoError = error as AxiosError<ApiResponse>
        toast({
          title : 'Error',
          description  : axisoError.response?.data.message,
          variant  : 'destructive'
        })
      }
      finally{
        setisSubmitting(false)
      }
      
    }

    const form = useForm({
        resolver : zodResolver(passwordSchema),
        defaultValues : {
            password : '',
            confirmPassword : ''
        }
    })


  return (
    <div className='py-12 flex justify-center items-start min-h-screen bg-gray-50 px-4'>
        <div className='w-full max-w-2xl bg-white rounded-2xl shadow-md p-6 md:p-10'>
      <h3 className='text-center  text-xl md:text-2xl'>Create your new password</h3>
      <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    
                <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700">Enter your New Password</FormLabel>
                  <FormControl>
                    <Input disabled={isSubmitting}
                      placeholder="Enter new password.."
                      {...field}
                      type='password'
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
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700">Confirm your New Password</FormLabel>
                  <FormControl>
                    <Input disabled={isSubmitting}
                      placeholder="Confirm new password..."
                      {...field}
                      type='password'
                      onChange={(e) => field.onChange(e)}
                      className="h-12"
                    />
                  </FormControl>
                  
                  <FormMessage />
                </FormItem>
              )}
            />
            { isSubmitting ? (
              <Loader2 className='animate-spin my-5  mx-auto' />
            ) : (
              <Button type='submit' className='my-5 mx-2'>Create New Password</Button>
            )
          }
            </form>
            </Form>

      </div>
    </div>
  )
}

export default page
