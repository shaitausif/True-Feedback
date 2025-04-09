'use client'
import React from 'react'
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
// importing User from next-auth
import {User} from 'next-auth'
import { Button } from './ui/button'

const Navbar = () => {
  // we won't get the information about the user from this data we'll get that from the User from next-auth
  // this data will only tell us about if the session is active or not
  const {data: session, status} = useSession()
  // taking data from User session
  // To know more : https://next-auth.js.org/getting-started/client
  const user: User = session?.user as User



  // If the User is authenticated then we'll obviously have a user session
  return (
    <nav className='p-4 md:p-6 shadow-md'>
      <div className='container mx-auto flex  flex-row justify-around items-center'>
        <Link className='text-xl font-bold mb-4 md:mb-0' href={'/'}>Mystery Message</Link>
        {
          session ? (
            <div>
            <span className='mr-4'>Welcome, {user?.username || user?.email}</span>
            <Button className='w-20 md:mx-auto' onClick={() => signOut()}>Logout</Button>
            </div>
            // If the user is not logged in
          ) : (
            
            
            <Link href={'/sign-in'}>
              <Button className='w-20 md:mx-auto'>Login</Button>
            </Link>
            
          )
        }      
      </div>
    </nav>
  )
}

export default Navbar
