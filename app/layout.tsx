import type { Metadata } from "next";
import { Geist, Geist_Mono, Google_Sans, Google_Sans_Code } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

const googleSans = Google_Sans({
    variable: "--font-google-sans",
    subsets: ["latin"],
});

const googleSansCode = Google_Sans_Code({
    variable: "--font-google-sans-code",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "Escape Room Queue",
    description: "Scones Escape Room Queue Website",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body
                className={`${googleSans.className} ${geistSans.variable} ${geistMono.variable} antialiased`}
            >
                {children}
            </body>
        </html>
    );
}

