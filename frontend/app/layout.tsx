import type { Metadata } from "next";
import "./scss/globals.scss";

import { Inter, } from "next/font/google";


const inter = Inter({
  weight: ['700', '600', '500', '400'],
  subsets: ['latin']
})


export const metadata: Metadata = {
  title: "Home",
  description: "Стартова сторінка",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="uk">      
      <body className={`${inter.className}`}>
        {children}
      </body>
    </html>
  );
}
