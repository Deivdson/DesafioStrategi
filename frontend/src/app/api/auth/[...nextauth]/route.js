import NextAuth, {NextAuthOptions} from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";
import { setCookie } from "nookies";
import { defineAxiosHeaderWithToken } from "@/api";
import { api } from "@/api";

const nextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: 'credencials',
            credencials: {
                email: {label: 'email', type: 'text'},
                password: {label: 'password', type: 'text'}
            },
            async authorize(credencials) {
                const data = {
                    email: credencials?.email,
                    password: credencials?.password
                }
                const response = await api.post("/auth/", data);
                
                const token = response.data.token
                // setCookie(null, 'token', token, {
                //     maxAge: 68400 * 7,
                //     path: '/' 
                // });     

                const user = await response
                if (user && response) {
                    console.log("setando token")
                    defineAxiosHeaderWithToken(token)
                    return user
                }
                return null
            },

            
        })
    ],
    pages: {
        signIn: '/components/page/login'
    }
}

const handler = NextAuth(nextAuthOptions)

export { handler as GET, handler as POST}