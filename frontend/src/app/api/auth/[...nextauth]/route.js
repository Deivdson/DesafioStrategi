import NextAuth, {NextAuthOptions} from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";
import { setCookie } from "nookies";
import { defineAxiosHeaderWithToken } from "@/api";
import { api } from "@/api";

const nextAuthOptions = {
    session: {
        strategy: 'jwt',
        jwt: true,
        maxAge: 60 * 60
    },
    secret: process.env.NEXTAUTH_SECRET,
    providers: [
        CredentialsProvider({         
            name: 'credentials',        
            credentials: {
                email: {label: 'email', type: 'text'},
                password: {label: 'password', type: 'text'}
            },
            authorize: async (credentials) => {
                const data = {
                    email: credentials?.email,
                    password: credentials?.password
                }                
                try{
                    const response = await api.login(data);
                    // const response = await api.post("/auth/", data);
                    console.log("RESPONSE: zz", response)
                    if (response){
                        const {token, user} = response
                        defineAxiosHeaderWithToken(token);
                        
                        setCookie(null, 'token', token, {
                            maxAge: 60 * 60 * 24,
                            path: '/' 
                        });  
                        return response
                    }                
                    return null
                } catch (error) {
                    console.error("ERROR 01",error)
                    return null
                }
                
            },

            
        })
    ],
    callbacks:{        
        jwt: async ({token, user}) => {
            if (user) {
                token.user = user;
            }            
            return {...token, ...user};
        },
        session: async ({ session, token, user }) => {            
            session.user = token
            return session
        }        
    },
    pages: {
        signIn: '/components/page/login'
    }
}

const handler = NextAuth(nextAuthOptions)

export { handler as GET, handler as POST}
