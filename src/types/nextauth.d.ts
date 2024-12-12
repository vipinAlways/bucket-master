import NextAuth, { DefaultSession, DefaultUser, JWT } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string; // Custom field
      email: string;
      userName?: string; // Optional field
      Avatar?: string; // Optional field for avatar image
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    id: string; // Custom user ID from your database
    email: string;
    userName?: string;
    Avatar?: string;
  }

  interface Profile {
    email?: string;
    name?: string;
    picture?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string; // Attach custom user ID to JWT
    email: string;
    userName?: string; // Optional field for username
    Avatar?: string; // Optional field for avatar image
  }
}
