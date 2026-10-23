import type { Metadata } from "next";
import { Playfair_Display, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { StoreProvider } from "@/lib/store-context";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppWidget from "@/components/WhatsAppWidget";
import CartDrawer from "@/components/CartDrawer";
import AnnouncementBar from "@/components/AnnouncementBar";

const editorialSerif = Playfair_Display({
  variable: "--font-editorial",
  subsets: ["latin"],
  display: "swap",
});

const modernSans = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "House of Addya | Modern Western Fashion for the Muse",
  description:
    "House of Addya is a modern fashion brand founded by Addya Dubey, focused on stylish, wearable and affordable Western clothing designed for confident young women.",
  keywords: [
    "House of Addya",
    "Addya Dubey",
    "Western wear",
    "Gen-Z fashion",
    "Corset tops",
    "Dresses",
    "Co-ords",
    "Indian fashion label",
  ],
  openGraph: {
    title: "House of Addya — Modern Western Silhouettes",
    description: "Trendy, confident and effortlessly stylish Western outfits.",
    type: "website",
    locale: "en_IN",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${editorialSerif.variable} ${modernSans.variable} h-full antialiased scroll-smooth`}
    >
      <body className="min-h-full flex flex-col font-sans bg-[#FCF9F9] text-[#1E171B]">
        <StoreProvider>
          <AnnouncementBar />
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
          <CartDrawer />
          <WhatsAppWidget />
        </StoreProvider>
      </body>
    </html>
  );
}
