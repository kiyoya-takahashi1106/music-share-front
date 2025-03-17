import { Geist, Geist_Mono } from "next/font/google";
import { AuthProvider } from "@/contexts/auth-context";
import { RoomsProvider } from "@/contexts/rooms-context";
import { RoomProvider } from "@/contexts/myRoom-context";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Music share",
  description: "U can share your favorite music with your friends",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ja">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <AuthProvider>
          <RoomsProvider>
            <RoomProvider>
              {children}
            </RoomProvider>
          </RoomsProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
