'use client'
import MessageCard from '@/components/MessageCard'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Switch } from '@/components/ui/switch'
import { useToast } from '@/hooks/use-toast'
import { Message } from '@/model/User'
import { acceptMessageSchema } from '@/schemas/acceptMessageSchema'
import { ApiResponse } from '@/types/ApiResponse'
import { zodResolver } from '@hookform/resolvers/zod'
import axios, { AxiosError } from 'axios'
import { Loader2, RefreshCcw } from 'lucide-react'
import { User } from 'next-auth'
import { useSession } from 'next-auth/react'
import React, { useCallback, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'


const page = () => {
  const [messages, setmessages] = useState<Message[]>([])
  const [isLoading, setisLoading] = useState(false)
  const [isSwitchLoading, setisSwitchLoading] = useState(false)


  const {toast} = useToast()

  // This method will handle the delete message functionality for client side
  const handleDeleteMessage = (messageId : string)=> {
    setmessages(messages.filter((message) => message._id !== messageId))

  }

  const {data: session} = useSession()
  
  // To know more about react hook forms go to this site : https://www.react-hook-form.com/get-started
  // we'll use react hook form for accept-messages status toggle button
  const form = useForm({
    resolver : zodResolver(acceptMessageSchema)
  })

  // To know more about watch : https://www.react-hook-form.com/api/useform/watch/
  // To know more about setValue : https://www.react-hook-form.com/api/useform/setvalue/
  const {register, watch, setValue} = form

  // We have to inject watch anywhere such that it know about the thing to be watched
  // this will watch for the acceptMessages field
  const acceptMessages = watch('acceptMessages')

  // This function will only re-render if it's dependecies changes
  // we're using useCallback hook for optimistics UI updates
  // so in this function we'll know the status of acceptingMessages of the User
  const fetchAcceptMessage = useCallback(async() => {
    setisSwitchLoading(true)
    try {
      const response = await axios.get('/api/accept-messages')
      // Here, you’re taking the value from the API response (isAcceptingMessages) and updating the form field acceptMessages.
      setValue('acceptMessages',response.data.isAcceptingMessages)
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>
      toast({
        title : 'Error',
        description : axiosError.response?.data.message || "Failed to fetch accept message setting",
        variant : 'destructive'
      })
    }finally{
      setisSwitchLoading(false)
    }
  },[setValue])

  // now fetch all the messages
  const fetchMessages = useCallback(async(refresh : boolean = false) => {
    setisLoading(true)
    try {
      const response = await axios.get<ApiResponse>('/api/get-messages')
      
      setmessages(response.data.messages || [])
      if(refresh){
        toast({
          title : 'Refreshed',
          description : 'Showing latest messages'
        })
      }

    } 
      catch (error) {
      const axiosError = error as AxiosError<ApiResponse>
      toast({
        title : 'Error',
        description : axiosError.response?.data.message || "Failed to fetch get message setting",
        variant : 'destructive'
      })
    }finally{
      setisLoading(false)
    }
  },[setisLoading, setmessages])


  useEffect(() => {
    if(!session || !session.user) return
    fetchMessages()
    fetchAcceptMessage()
  }, [session, setValue, fetchMessages, fetchAcceptMessage])
  
  // this function will run on the toggle button of the accept messages 
  // handle accept messages status change
  const handleSwitchChange = async() => {
    try {
      const response = await axios.post('/api/accept-messages', {
        acceptMessages : !acceptMessages
       })
      //  set the acceptMessages status
      setValue('acceptMessages',!acceptMessages)
       toast({
        title : response.data.message
       })
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>
      toast({
        title : 'Error',
        description : axiosError.response?.data.message || "Failed to fetch accept message setting",
        variant : 'destructive'
      })
    }
     
  }




  if(!session || !session.user){
    return <>
    <div className='mx-auto justify-center h-20'>
      <h1>User is not Authenticated</h1>
    </div>
    </>
  }


    // Url to send the messages to the User
    const { username } = session?.user as User
    // TODO : do more research about finding out the URL's of the user
    const baseUrl =  `${window.location.protocol}//${window.location.host}`
    const profileUrl = `${baseUrl}/u/${username}`


      // Copy to Clipboard function
  const copyToClipboard = () => {
    navigator.clipboard.writeText(profileUrl)
    toast({
      title : 'URL copied successfully',
      description : "Profile URL has been copied to clipboard"
    })
  }

  return (
    <div className='my-8 mx-4 md:mx-8 lg:mx-auto p-6 bg-white rounded w-full max-w-6xl '>
      <h1 className='text-4xl font-bold mb-4'>User Dashboard</h1>
      <div className='mb-4'>
        <h2 className='text-lg font-semibold mb-2'>Copy your Unique Link</h2>{' '}
        <div className='flex items-center'>
          <input
          value={profileUrl}
          disabled
          className='input input-bordered w-full p-2 mr-2'
          type="text" />
          <Button onClick={copyToClipboard}>Copy</Button>

        </div>
      </div>

      <div className='mb-4'>
        <Switch
        {...register('acceptMessages')}
        checked={acceptMessages}
        onCheckedChange={handleSwitchChange}
        disabled={isSwitchLoading}
        />
      <span className='ml-2'>
        Accept Messages : {acceptMessages ? "On" : "Off"}
      </span>
  
      </div>
      <Separator/>

      <Button
      className='mt-4'
      variant={'outline'}
      onClick={(e) => {
        e.preventDefault()
        fetchMessages(true)
      }}
      >
        {
          isLoading ? (
            <Loader2 className='h-4 w-4 animate-spin' />

          ) : (
            <RefreshCcw className='h-4 w-4' />

          )
        }
        
      </Button>
      <div className='mt-4 grid grid-cols-1 md:grid-cols-2 gap-6'>
        {
          messages.length > 0 ? (
            messages.map((message, index) => (
              <MessageCard
              key={index}
              message={message}
              onMessageDelete={handleDeleteMessage}
              />
            )  )
          ) : (
            <p>No messages to display.</p>
          )
        }
      </div>
    </div>
  )
}

export default page
