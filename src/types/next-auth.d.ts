// Here in this file we can define or modify the existing data types
// Here i will play with the interface of next-auth module so i have to import that module first
// It's a declaration file
// For More Info : https://next-auth.js.org/getting-started/typescript
import "next-auth";
import { DefaultSession } from "next-auth";

declare module "next-auth" {
  // Here i am redefining the User interface to get rid from the from this line of code token._id = user._id?.toString() api -> auth -> options.ts
  interface User {
    _id?: string;
    isVerified?: boolean;
    isAcceptingMessages?: boolean;
    username?: string;
  }
  // redefine the session interface
  interface Session {
    user: {
      _id?: string;
      isVerified?: boolean;
      isAcceptingMessages?: boolean;
      username?: string;
    //   here i am saying that if there is DefaultSession then there will always be a user key in it 
    } & DefaultSession['user']

  }
}

// another way of redeclaring a module
declare module 'next-auth/jwt'{
    interface JWT{
      _id?: string;
      isVerified?: boolean;
      isAcceptingMessages?: boolean;
      username?: string;
    }
}
