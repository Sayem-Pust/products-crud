import NextAuth from "next-auth";
import CredentialProvider from "next-auth/providers/credentials";

export default NextAuth({
  providers: [
    CredentialProvider({
      async authorize(credentials) {
        console.log(credentials);
        const baseUrl = "https://dummyjson.com";
        const response = await fetch(baseUrl + "/auth/login", {
          method: "POST",
          body: JSON.stringify(credentials),
          headers: {
            "Content-Type": "application/json",
          },
        });
        const data = await response.json();
        // Returning token to set in session
        return {
          token: data.token,
        };
      },
    }),
  ],
  callbacks: {
    jwt: async ({ token, user }) => {
      user && (token.user = user);
      return token;
    },
    session: async ({ session, token }) => {
      session.user = token.user; // Setting token in session
      return session;
    },
  },
  pages: {
    signIn: "/login", //Need to define custom login page (if using)
  },
});