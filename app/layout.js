import { Inter } from "next/font/google";
import "./globals.css";

export const metadata = {
  title: "The hood customs Stats",
  description: "Fuck you.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
