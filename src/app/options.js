import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const options = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      async authorize(credentials, req) {
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
          console.log(data);
           if (data.token) {

             return data;
           } else {
             console.log("check your credentials");
             return null;
           }
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
};

// export default NextAuth({
//   providers: [
//     CredentialProvider({
//       async authorize(credentials) {
//         console.log(credentials);
//         const baseUrl = "https://dummyjson.com";
//         const response = await fetch(baseUrl + "/auth/login", {
//           method: "POST",
//           body: JSON.stringify(credentials),
//           headers: {
//             "Content-Type": "application/json",
//           },
//         });
//         const data = await response.json();
//         // Returning token to set in session
//         return {
//           token: data.token,
//         };
//       },
//     }),
//   ],
//   callbacks: {
//     jwt: async ({ token, user }) => {
//       user && (token.user = user);
//       return token;
//     },
//     session: async ({ session, token }) => {
//       session.user = token.user; // Setting token in session
//       return session;
//     },
//   },
//   pages: {
//     signIn: "/login", //Need to define custom login page (if using)
//   },
// });
