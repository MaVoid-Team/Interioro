import type { Metadata } from "next";
import { Noto_Serif, Manrope, IBM_Plex_Sans_Arabic } from "next/font/google";
import "../globals.css";
import { Navbar } from "@/components/Landing/Navbar";
import { Footer } from "@/components/Landing/Footer";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { Toaster } from "sonner";
import { ThemeProvider } from "@/components/theme-provider";

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

// IBM Plex Sans Arabic - Professional Arabic font that pairs perfectly with Manrope
const ibmPlexArabic = IBM_Plex_Sans_Arabic({
    variable: "--font-ibm-plex-arabic",
    weight: ["300", "400", "500", "600", "700"],
    subsets: ["arabic"],
    display: "swap",
});

export const metadata: Metadata = {
    title: "Al-Nojoom Al-Rakia",
    description: "Premium E-commerce Store",
    icons: {
        icon: [
            { url: '/Logo_with_background.png', sizes: '32x32', type: 'image/png' },
            { url: '/Logo_with_background.png', sizes: '192x192', type: 'image/png' },
        ],
        shortcut: '/Logo_with_background.png',
        apple: [
            { url: '/Logo_with_background.png', sizes: '180x180', type: 'image/png' },
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
        <html lang={locale} dir={locale === 'ar' ? 'rtl' : 'ltr'}>
                <body
                    className={`${notoSerif.variable} ${manrope.variable} ${ibmPlexArabic.variable} ${locale === 'ar' ? ibmPlexArabic.className : manrope.className} antialiased`}
                >
                <NextIntlClientProvider messages={messages}>
                    <AuthProvider>
                        <ThemeProvider
                            attribute="class"
                            defaultTheme="system"
                            enableSystem
                            disableTransitionOnChange
                        >
                            <CartProvider>
                                <Navbar />
                                <Toaster position="bottom-right" richColors />
                                {children}
                                <Footer />
                            </CartProvider>
                        </ThemeProvider>
                    </AuthProvider>
                </NextIntlClientProvider>
            </body>
        </html>
    );
}
