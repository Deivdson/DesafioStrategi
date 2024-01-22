
import NextAuthSessionProvider from '@/auth/providers/sessionProvider'
import NavBar from '@/components/layout/navbar'
import './globals.css'

export const metadata = {
  title: 'Heroes app',
  description: 'Gerenciamento de heróis',
}

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body>
        <NextAuthSessionProvider>
          <NavBar />
          <div>
            {children}
          </div>
        </NextAuthSessionProvider>
      </body>
    </html>
  )
}
