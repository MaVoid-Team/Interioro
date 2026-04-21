import type { Metadata } from "next";
import { Noto_Serif, Manrope, Fustat } from "next/font/google";
import "../globals.css";
import { Navbar } from "@/components/Landing/Navbar";
import { Footer } from "@/components/Landing/Footer";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { Toaster } from "sonner";

// Noto Serif - The brand's voice. Elegant and artistic authority.
const notoSerif = Noto_Serif({
    variable: "--font-noto-serif",
    subsets: ["latin"],
    display: "swap",
});

// Manrope - Clean geometric sans-serif for high legibility.
const manrope = Manrope({
    variable: "--font-manrope",
    subsets: ["latin"],
    display: "swap",
});

// Fustat - Google Arabic font for the Arabic storefront.
const fustatArabic = Fustat({
    variable: "--font-fustat-arabic",
    weight: ["300", "400", "500", "600", "700"],
    subsets: ["arabic"],
    display: "swap",
});

export const metadata: Metadata = {
    title: "Interioro",
    description: "Premium Wall Decorations, Wallpapers & Wall Art Store",
    icons: {
        icon: [
            { url: '/new-logo.png', sizes: '32x32', type: 'image/png' },
            { url: '/new-logo.png', sizes: '192x192', type: 'image/png' },
        ],
        shortcut: '/new-logo.png',
        apple: [
            { url: '/new-logo.png', sizes: '180x180', type: 'image/png' },
        ],
    },
};

export default async function RootLayout({
    children,
    params
}: {
    children: React.ReactNode;
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;
    const messages = await getMessages();

    return (
        <html lang={locale} dir={locale === 'ar' ? 'rtl' : 'ltr'} suppressHydrationWarning>
            <body
                className={`${notoSerif.variable} ${manrope.variable} ${fustatArabic.variable} ${locale === 'ar' ? fustatArabic.className : manrope.className} antialiased`}
            >
                <NextIntlClientProvider messages={messages}>
                    <AuthProvider>
                        <CartProvider>
                            <Navbar />
                            <Toaster position="bottom-right" richColors />
                            {children}
                            <Footer />
                        </CartProvider>
                    </AuthProvider>
                </NextIntlClientProvider>
            </body>
        </html>
    );
}
