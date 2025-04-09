"use client";
import React, { useState } from "react";
import { useParams } from "next/navigation";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/types/ApiResponse";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { Form } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { messageSchema } from "@/schemas/messageSchema";
import { z } from "zod";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, Sparkles } from "lucide-react";



const Page = () => {
  const { toast } = useToast();
  const params = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [suggestedMessages, setSuggestedMessages] = useState<string[]>([]);
  const [suggestLoading, setSuggestLoading] = useState(false);

  const form = useForm<z.infer<typeof messageSchema>>({
    resolver: zodResolver(messageSchema),
    defaultValues: {
      content: "",
    },
  });

  const handleSendMessage = async (data: z.infer<typeof messageSchema>) => {
    try {
      setIsLoading(true);
      const response = await axios.post("/api/send-message", {
        username: params.username,
        content: data.content,
      });
      toast({
        title: "Success",
        description: response.data.message,
      });
      form.reset({...form.getValues(),content: ''})
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: "Error",
        description:
          axiosError.response?.data.message || "Failed to send message",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };



  // Dummy handler – You will replace this
  const handleSuggestMessages = async () => {
    try {
      setSuggestLoading(true);
      const response = await fetch("/api/suggest-messages", {
        method: "POST",
      });
  
      if (!response.ok) throw new Error("Failed to get suggestions");
  
      const rawData = await response.json();
      console.log("Raw data:", rawData);
  
      const parsedSuggestions: string[] = [];
  
      // If it's a single string
      if (typeof rawData === "string") {
        try {
          const parsed = JSON.parse(rawData);
          if (parsed?.result) {
            parsedSuggestions.push(
              ...parsed.result
                .split("\n")
                .map((msg: string) => msg.trim())
                .filter(Boolean)
            );
          }
        } catch {
          // Not JSON, just treat as a single message
          parsedSuggestions.push(rawData);
        }
      }
  
      // If it's an object with "result"
      else if (rawData?.result && typeof rawData.result === "string") {
        parsedSuggestions.push(
          ...rawData.result
            .split("\n")
            .map((msg: string) => msg.trim())
            .filter(Boolean)
        );
      }
  
      // If it's an array
      else if (Array.isArray(rawData)) {
        for (const item of rawData) {
          try {
            const parsed = JSON.parse(item);
            if (parsed?.result) {
              parsedSuggestions.push(
                ...parsed.result
                  .split("\n")
                  .map((msg: string) => msg.trim().replace(/^\d+\.\s*/, ""))
                  .filter(Boolean)
                  
              );
            } else {
              parsedSuggestions.push(item);
            }
          } catch {
            parsedSuggestions.push(item);
          }
        }
      }
  
      setSuggestedMessages(parsedSuggestions);
    } catch (error) {
      console.error("Error while fetching suggested messages:", error);
    } finally {
      setSuggestLoading(false);
    }
  };
  
  

  return (
    <div className="py-12 flex justify-center items-start min-h-screen bg-gray-50 px-4">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-md p-6 md:p-10">
        <h1 className="text-center text-2xl md:text-3xl font-bold mb-6 text-gray-800">
          Send Anonymous Message to @{params.username}
        </h1>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSendMessage)}
            className="space-y-6"
          >
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700">Your Message</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Write your anonymous message here..."
                      {...field}
                      onChange={(e) => field.onChange(e)}
                      className="h-12"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-center">
              <Button
                type="submit"
                disabled={isLoading}
                className="w-fit h-12 text-md"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Please wait
                  </>
                ) : (
                  "Send Message"
                )}
              </Button>
            </div>
            
          </form>
        </Form>
        

        {/* Suggest Message Button */}
        <div className="flex justify-center mt-6">
          <Button
            type="button"
            variant="secondary"
            onClick={handleSuggestMessages}
            disabled={suggestLoading}
            className="gap-2"
          >
            <Sparkles className="w-4 h-4" />
            {suggestLoading ? "Loading..." : "Suggest Messages"}
          </Button>
        </div>

        {/* Suggested Messages Display */}
        {suggestedMessages.length > 0 && (
          <div className="mt-8">
            <h2 className="text-lg font-semibold mb-3 text-gray-700">
              Suggested Messages:
            </h2>
            <ul className="space-y-3">
              {suggestedMessages.map((msg, index) => (
                <li
                  key={index}
                  className="bg-gray-100 border hover:scale-105 hover:shadow-md transition-all border-gray-200 p-4 rounded-lg shadow-sm text-gray-800"
                  onClick={() => form.setValue('content',msg)}
                >
                  {msg}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default Page;
