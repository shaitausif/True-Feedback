'use client'

import { Button } from '@/components/ui/button'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { useToast } from '@/hooks/use-toast'
import { verifySchema } from '@/schemas/verifySchema'
import { ApiResponse } from '@/types/ApiResponse'
import { zodResolver } from '@hookform/resolvers/zod'
import axios, { AxiosError } from 'axios'
import { useParams, useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Form } from '@/components/ui/form'
import * as z from 'zod'
import { Loader2 } from 'lucide-react'
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from '@/components/ui/input-otp'

const Page = () => {
    const router = useRouter()
    const params = useParams()
    const { toast } = useToast()
    const [isVerifying, setIsVerifying] = useState(false)

    const form = useForm<z.infer<typeof verifySchema>>({
        resolver: zodResolver(verifySchema),
        defaultValues: {
            code: ''
        }
    });

    const onSubmit = async (data: z.infer<typeof verifySchema>) => {
        try {
            setIsVerifying(true)
            const response = await axios.post('/api/verify-code', {
                username: params.username,
                code: data.code
            })

            toast({
                title: response.data.success ? "Success" : "Failed",
                description: response.data.message
            })

            if (response.data.success) {
                router.replace('/sign-in')
            }
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>;
            toast({
                variant: "destructive",
                title: "Verification Failed",
                description: axiosError.response?.data.message || "",
            });
        } finally {
            setIsVerifying(false)
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
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-6"
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                e.preventDefault(); // prevent default
                                form.handleSubmit(onSubmit)(); // manually submit
                            }
                        }}
                    >
                        <FormField
                            control={form.control}
                            name="code"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Verification Code</FormLabel>
                                    <FormControl>
                                        <div className="flex justify-center">
                                            <InputOTP
                                                maxLength={6}
                                                value={field.value}
                                                onChange={field.onChange}
                                                onKeyPress={(e) => {
                                                    if (!/[0-9]/.test(e.key)) {
                                                        e.preventDefault();
                                                    }
                                                }}
                                            >
                                                <InputOTPGroup>
                                                    <InputOTPSlot index={0} />
                                                    <InputOTPSlot index={1} />
                                                    <InputOTPSlot index={2} />
                                                </InputOTPGroup>
                                                <InputOTPSeparator />
                                                <InputOTPGroup>
                                                    <InputOTPSlot index={3} />
                                                    <InputOTPSlot index={4} />
                                                    <InputOTPSlot index={5} />
                                                </InputOTPGroup>
                                            </InputOTP>
                                        </div>
                                    </FormControl>
                                    <div className='flex justify-center'>
                                    <FormMessage />
                                    </div>
                                </FormItem>
                            )}
                        />
                        <Button disabled={isVerifying} type="submit" className="w-full">
                            {isVerifying ? (
                                <>
                                    <Loader2 className="animate-spin mr-2 h-4 w-4" />
                                    Please wait
                                </>
                            ) : (
                                'Verify'
                            )}
                        </Button>
                    </form>
                </Form>
            </div>
        </div>
    )
}

export default Page
