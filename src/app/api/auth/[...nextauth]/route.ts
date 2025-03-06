import NextAuth, { Session, SessionStrategy, User } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { JWT } from "next-auth/jwt";
import { decrypt } from "@/app/lib/session";

export const authOptions = {
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

        const userData = await decrypt(data.access_token)
        
        const user = {
            id: userData?.id as string,
            name: userData?.sub, // You can fetch full name from DB
            image: data.access_token as string, // Store JWT token
        } as User

        return user; // Must return an object with `id`, `name`, or `email`
      },
    }),
  ],
  pages: {
    signIn: "/login", // Redirect to custom login page
  },
  secret: process.env.NEXT_PUBLIC_SESSION_SECRET,
  session: {
    strategy: "jwt" as SessionStrategy,
  },
  callbacks: {
    async session({ session, token }: { session: Session, token: JWT }) {
        session.user = {
            email: token.id as string,
            name: token.name,
            image: token.token as string
        }
        return session;
      },
      async jwt({ token, user }: { token: JWT, user?: User }) {
        if (user) {
            token.id = user.id;
            token.name = user.name;
            token.token = user.image; // Store JWT token in session
          }
        return token;
      },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
