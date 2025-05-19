"use client";
// zodResolver is a bridge between the Zod validation library and React Hook Form.

// Zod: A TypeScript-first schema declaration and validation library.
// React Hook Form: A library to manage forms in React efficiently.
// It allows React Hook Form to use Zod schemas for validation seamlessly.

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useDebounceValue, useDebounceCallback } from "usehooks-ts";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { Form, FormField, FormItem, FormControl, FormDescription, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { signInSchema } from "@/schemas/signInSchema";
import { signIn } from "next-auth/react";

const page = () => {

  const [isSubmitting, setisSubmitting] = useState(false);

  const { toast } = useToast();
  const router = useRouter();

  // https://www.react-hook-form.com/get-started
  // here we're giving surity that the value given by resolver will the signupSchema
  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      identifier: "",
      password: "",
    },
  });


  const onSubmit = async (data: z.infer<typeof signInSchema>) => {
        // we've designed the sign-up process manually and now here we're designing the sign-in process using next-auth
        setisSubmitting(true)
        const result = await signIn('credentials', {
          identifier : data.identifier,
          password : data.password,
          redirect : false
        })
        if(result?.error){
          setisSubmitting(false)
          toast({
            title : "Login Failed",
            description : "Incorrect Username or Password",
            variant : 'destructive'
          })
        }
        setisSubmitting(false)
        // We're taking the automatic redirection of signIn function in our hand
        if(result?.url){

          router.replace('/dashboard')
        }

  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h2 className="text-4xl font-bold tracking-tight lg:text-5xl mb-6">
            Join True Feedback
          </h2>
          <p className="mb-4">Sign In to start your anonymous adventure</p>
        </div>
        {/* To Know more about shadcn's form: https://ui.shadcn.com/docs/components/form */}
        <Form {...form}>
          <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
           
            <FormField
              control={form.control}
              name="identifier"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email/Username</FormLabel>
                  <FormControl>
                    <Input
                     placeholder="Enter Email or Username" 
                    //  It will not store the values as per the input of the user but it will take the values written in this field on the execution of onSubmit function
                     {...field}
                     
                     />
                  </FormControl>
                  
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password"
                     placeholder="Enter Password" 
                    //  It will not store the values as per the input of the user but it will take the values written in this field on the execution of onSubmit function
                     {...field}
                     
                     />
                     
                  </FormControl>
                  <div className="flex justify-start px-2">

                  
                  <Link className="text-sm hover:text-blue-600" href={'/forget-password'}>Forgot password?</Link>
                  </div>
                  <FormMessage />
                </FormItem>
              )}  
            />
            <Button type="submit" disabled={isSubmitting}>
              {
                isSubmitting ? (
                  <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin"/>
                  <p>Please wait</p>
                  </>
                ) : "Sign In"
              }
              </Button>
          </form>
        </Form>
        <div className="text-center mt-4">
              <p>
                Don't have an account?{' '}
                <Link
                 className="text-blue-600 hover:text-blue-800"
                  href={'/sign-up'}>
                    Sign Up</Link>

              </p>
        </div>
      </div>
    </div>
  );
};

export default page;
