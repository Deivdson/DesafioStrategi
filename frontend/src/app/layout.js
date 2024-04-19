import NextAuthSessionProvider from "@/auth/providers/sessionProvider";
import NavBar from "@/components/layout/navbar";
import "./globals.css";
import { ConfigProvider } from "antd";
export const metadata = {
  title: "Heroes app",
  description: "Gerenciamento de heróis",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body>
        <ConfigProvider
          theme={{
            components: {
              Modal: {
                colorBgBase: "102732",
                activeBg: "ffffff",
                colorBgElevated: "#102732",
                borderRadius: "5rem",
                colorError: "red",
              },
              Transfer: {
                colorPrimary: "#00b96b",
                borderRadius: 2,

                colorBgContainer: "white",
                colorBgBase: "#102732",

                activeBg: "ffffff",
                borderRadiusLG: "5px",
                contentBg: "102732",
              },
              Select: {
                colorBgBase: "white",
                contentBg: "white",
                activeBg: "ffffff",
                colorSplit: "white",
              },
            },
            token: {
              // Seed Token

              borderRadius: 5,

              // Alias Token
              colorBgContainer: "white",

              colorBgElevated: "white",

              colorBgBase: "102732",

              activeBg: "ffffff",
              borderRadiusLG: "5px",
              contentBg: "102732",

              colorSplit: "white",
            },
          }}
        >
          <NextAuthSessionProvider>
            <NavBar />
            <div>{children}</div>
          </NextAuthSessionProvider>
        </ConfigProvider>
      </body>
    </html>
  );
}
