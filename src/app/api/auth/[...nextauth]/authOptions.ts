import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { decrypt } from '@/app/lib/session';
import { Session, User } from "next-auth";
import { JWT } from "next-auth/jwt";
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const res = await fetch(`${process.env.API_URL}/auth/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            username: credentials?.username,
            password: credentials?.password,
          }),
        });

        if (!res.ok) return null;

        const data = await res.json();
        const userData = await decrypt(data.access_token);

        const user = {
          id: userData?.id as string,
          name: userData?.sub,
          image: data.access_token as string,
        } as User;

        return user;
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  secret: process.env.NEXT_PUBLIC_SESSION_SECRET,
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async session({ session, token }: { session: Session; token: JWT }) {
      session.user = {
        email: token.id as string,
        name: token.name,
        image: token.token as string,
      };

      return session;
    },
    async jwt({ token, user }: { token: JWT; user?: User }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.token = user.image;
      }
      return token;
    },
  },
  events: {
    async signIn({ user }) {
      // Store the JWT in an HTTP-only cookie
      if (user?.image) {
        (await cookies()).set("token", user.image, {
          path: "/",
          httpOnly: true,
          // secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
        });
      }  
    },
  },
};

export default authOptions;