'use client'
import React, { useState } from 'react'
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { User } from 'next-auth'
import { Button } from './ui/button'
import useMediaQuery from '@/hooks/useMediaQuery'
import clsx from 'clsx'

const Navbar = () => {
  const { data: session } = useSession()
  const user: User = session?.user as User
  const isSmallScreen = useMediaQuery('(max-width: 767px)')

  const [menuOpen, setMenuOpen] = useState(false)
  const toggleMenu = () => setMenuOpen(prev => !prev)

  return (
    <nav className='p-3 md:p-6 shadow-md'>
      <div className='container mx-auto flex flex-row justify-between md:justify-around items-center relative'>
        <Link className='md:text-xl text-center text-md font-bold md:mb-4' href={'/'}>True Feedback</Link>

        {session ? (
          <div className='relative'>
            {isSmallScreen ? (
              <>
                <button onClick={toggleMenu} className='font-medium'>
                  Welcome, {user?.username || user?.email}
                </button>
                <div
                  className={clsx(
                    'absolute right-0 mt-2 bg-white border shadow-md rounded-lg z-10 transform transition-all duration-300 origin-top',
                    menuOpen
                      ? 'opacity-100 scale-y-100'
                      : 'opacity-0 scale-y-0 pointer-events-none'
                  )}
                >
                  <Button
                    onClick={() => signOut()}
                    className='block px-4 py-2 text-left w-full hover:bg-gray-100'
                  >
                    Logout
                  </Button>
                </div>
              </>
            ) : (
              <>
                <span className='mr-4'>Welcome, {user?.username || user?.email}</span>
                <Button className='w-12 md:w-20 md:mx-auto' onClick={() => signOut()}>Logout</Button>
              </>
            )}
          </div>
        ) : (
          <Link href={'/sign-in'}>
            <Button className='w-12 md:w-20 md:mx-auto'>Login</Button>
          </Link>
        )}
      </div>
    </nav>
  )
}

export default Navbar
