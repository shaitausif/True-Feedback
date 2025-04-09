// Middleware is a function that runs before the main request handler to modify, validate, or process the request.
// I wrote this middleware after route.ts of api/auth

// For More info: https://nextjs.org/docs/app/building-your-application/routing/middleware

// The most simple usage is when you want to require authentication for your entire site. You can add a middleware.js file with the following:
export { default } from "next-auth/middleware"
// This is method to read a JSON Web Token from an API route
import { getToken } from "next-auth/jwt"
import { NextResponse } from 'next/server'
import { NextRequest } from 'next/server'
 


// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {

    // get the token
    const token = await getToken({req : request})
    // current URL
    const url = request.nextUrl

    // strategy for redirection
    if(token &&
        (
          url.pathname === '/sign-in' ||
          url.pathname === '/sign-up' ||
          url.pathname === '/verify' ||
          url.pathname === '/' // only redirect from homepage
        )
    ){
        return NextResponse.redirect(new URL('/dashboard', request.url))
    }
    else if(!token && url.pathname === '/dashboard'){
      return NextResponse.redirect(new URL('/sign-in',request.url))
    }
    return NextResponse.next()


}
 
// See "Matching Paths" below to learn more
// config is a file which contains the path to run the middleware
export const config = {
  matcher: ['/sign-in',
    '/sign-up',
    '/',
    '/dashboard/:path*',
    '/  :path*'
 ] ,
}