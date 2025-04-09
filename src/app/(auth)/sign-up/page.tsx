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
import {  useDebounceCallback } from "usehooks-ts";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { signUpSchema } from "@/schemas/signUpSchema";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/types/ApiResponse";
import { Form, FormField, FormItem, FormControl, FormDescription, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

const page = () => {
  // Here we've created a state for username handling where we're using debouncing technique to check for usename availability by sending the request to the database. and
  // Debouncing is a programming technique that limits the rate at which a function (like an API call) is executed.
  const [username, setusername] = useState("");
  const [usernameMessage, setusernameMessage] = useState("");
  const [isCheckingUsername, setisCheckingUsername] = useState(false);
  const [isSubmitting, setisSubmitting] = useState(false);
  // Using usehooks-ts which is an open-source TypeScript library that provides a collection of reusable React hooks
  // After the username state changes, wait 500 milliseconds.
  // If username doesn't change again during those 500ms, then debouncedUsername is updated with the value of username.
  // More about debounce: https://usehooks-ts.com/react-hook/use-debounce-callback
  const debounced = useDebounceCallback(setusername, 500);
  const { toast } = useToast();
  const router = useRouter();

  // https://www.react-hook-form.com/get-started
  // here we're giving surity that the value given by resolver will the signupSchema
  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    const checkUniqueUsername = async () => {
        // because of debouncing if the state username value didn't changed for 5 ms then it will set the updated value in the username
      if (username) {
        setisCheckingUsername(true);
       
        try {
          const Response = await axios.get(
            `/api/check-unique-username?username=${username}`
          );
          console.log(Response);
          setusernameMessage(Response.data.message);
        } catch (error) {
          const axiosError = error as AxiosError<ApiResponse>;
          setusernameMessage(
            axiosError.response?.data.message ?? "Error in checking username"
          );
        } finally {
          setisCheckingUsername(false);
        }
      }
    };
    checkUniqueUsername();
  }, [username]);

  const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
    setisSubmitting(true);
    try {
      const Response = await axios.post("/api/sign-up", data);
      console.log(Response);
      toast({
        title: Response.data.success ? "Success" : "Failed",
        description: Response.data.message,
      });
      // Replace the current sign-up page url with verify page such that user can verify
      router.replace(`/verify/${username}`);
    } catch (error) {
      console.log("Error in Sign up of the User.");
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        variant: "destructive",
        title: "Error in Signing Up the User",
        description: axiosError.response?.data.message || "",
      });
    } finally {
      setisSubmitting(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h2 className="text-4xl font-bold tracking-tight lg:text-5xl mb-6">
            Join Mystery Message
          </h2>
          <p className="mb-4">Sign Up to start your anonymous adventure</p>
        </div>
        {/* To Know more about shadcn's form: https://ui.shadcn.com/docs/components/form */}
        <Form {...form}>
          <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input
                     placeholder="Enter Username" 
                     {...field}
                     onChange={(e) => {
                      field.onChange(e)
                    //   will set the value of username after 5 ms of ending of typing from the user
                      debounced(e.target.value)
                     }}

                     />
                  </FormControl>
                  {isCheckingUsername && <Loader2 className="animate-spin" />}
                  <p className={`text-sm ${usernameMessage === "Username is available" ? 'text-green-500' : 'text-red-500'}`}>
                      {usernameMessage}
                  </p>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                     placeholder="Enter Email-ID" 
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
                  
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" onClick={() => {setusernameMessage('')}} disabled={isSubmitting}>
              {
                isSubmitting ? (
                  <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin"/>
                  <p>Please wait</p>
                  </>
                ) : "Sign Up"
              }
              </Button> 
          </form>
        </Form>
        <div className="text-center mt-4">
              <p>
                Already a member?{' '}
                <Link
                 className="text-blue-600 hover:text-blue-800"
                  href={'/sign-in'}>
                    Sign In</Link>

              </p>
        </div>
      </div>
    </div>
  );
};

export default page;
