"use client"

import * as React from "react"
import { Link } from "@/i18n/navigation"
import Image from "next/image"
import { List } from "@phosphor-icons/react"
import { Button } from "@/components/ui/button"
import { SearchBar } from "@/components/Landing/SearchBar"
import { Cart } from "@/components/Landing/Cart"
import { useTranslations } from "next-intl"
import { useAuth } from "@/context/AuthContext"
import { LanguageSwitcher } from "@/components/ui/LanguageSwitcher"
import { ThemeSwitcher } from "@/components/ui/theme-switcher"
import { motion, AnimatePresence } from "framer-motion"
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
    SheetClose,
} from "@/components/ui/sheet"

export function Navbar() {
    const t = useTranslations('Navbar')
    const { isAuthenticated, logout, user } = useAuth()
    const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false)

    return (
        <div className="fixed top-4 inset-x-0 z-50 flex justify-center px-4 pointer-events-none">
            <motion.header 
                initial={{ y: -100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ type: "spring", stiffness: 100, damping: 20 }}
                className="glass pointer-events-auto flex items-center justify-between h-16 px-4 md:px-8 rounded-full w-full max-w-screen-xl shadow-lg"
            >
                {/* Left: Logo */}
                <div className="flex items-center shrink-0">
                    <Link href="/" className="flex items-center gap-3 transition-opacity hover:opacity-90">
                        <div className="relative h-10 w-10 overflow-hidden rounded-full border-2 border-primary/10">
                            <Image
                                src="/Logo.png"
                                alt="Al-Nojoom Logo"
                                fill
                                className="object-cover"
                                priority
                            />
                        </div>
                        <span className="hidden font-serif font-bold tracking-tight lg:inline-block text-primary text-lg">
                            {t('companyName')}
                        </span>
                    </Link>
                </div>

                {/* Middle: Nav Items */}
                <nav className="hidden md:flex items-center gap-6 lg:gap-8 text-sm font-medium text-on-surface/70">
                    {[
                        { name: t('home'), href: "/" },
                        { name: t('products'), href: "/products" },
                        { name: t('bundles'), href: "/bundles" },
                        { name: t('categories'), href: "/categories" },
                    ].map((item) => (
                        <Link 
                            key={item.href}
                            href={item.href} 
                            className="hover:text-primary transition-colors duration-200 relative group"
                        >
                            {item.name}
                            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full" />
                        </Link>
                    ))}
                    {isAuthenticated && (
                        <Link href="/orders" className="hover:text-primary transition-colors duration-200 relative group">
                            {t('orders')}
                            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full" />
                        </Link>
                    )}
                    {isAuthenticated && user?.role === 'admin' && (
                        <Link href="/admin" className="hover:text-primary transition-colors duration-200 relative group">
                            {t('adminDashboard')}
                            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full" />
                        </Link>
                    )}
                </nav>

                {/* Right: Actions */}
                <div className="flex items-center gap-2 sm:gap-4">
                    <div className="md:hidden">
                        <SearchBar />
                    </div>

                    <Cart />
                    <LanguageSwitcher />
                    <ThemeSwitcher />

                    <div className="hidden items-center gap-3 md:flex ms-4">
                        {isAuthenticated ? (
                            <>
                                <Link href="/profile">
                                    <Button variant="ghost" size="sm" className="rounded-full">
                                        {t('profile')}
                                    </Button>
                                </Link>
                                <Button variant="ghost" size="sm" className="rounded-full" onClick={logout}>
                                    {t('logout')}
                                </Button>
                            </>
                        ) : (
                            <>
                                <Link href="/auth/login">
                                    <Button variant="ghost" size="sm" className="rounded-full">
                                        {t('login')}
                                    </Button>
                                </Link>
                                <Link href="/auth/signup">
                                    <Button size="sm" className="rounded-full font-medium">
                                        {t('signup')}
                                    </Button>
                                </Link>
                            </>
                        )}
                        <div className="ms-2">
                            <SearchBar />
                        </div>
                    </div>

                    {/* Mobile Menu */}
                    <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                        <SheetTrigger asChild>
                            <Button variant="ghost" size="icon" className="md:hidden rounded-full">
                                <List className="h-5 w-5" />
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="right" className="w-[85vw] max-w-[320px] sm:w-[350px] bg-surface">
                            <SheetHeader>
                                <SheetTitle className="font-serif text-primary">{t('companyName')}</SheetTitle>
                            </SheetHeader>
                            <div className="flex flex-col gap-6 mt-8">
                                <nav className="flex flex-col gap-2">
                                    {[
                                        { name: t('home'), href: "/" },
                                        { name: t('products'), href: "/products" },
                                        { name: t('bundles'), href: "/bundles" },
                                        { name: t('categories'), href: "/categories" },
                                    ].map((item) => (
                                        <SheetClose key={item.href} asChild>
                                            <Link
                                                href={item.href}
                                                className="flex items-center px-4 py-3 text-base font-medium rounded-xl hover:bg-secondary transition-colors"
                                            >
                                                {item.name}
                                            </Link>
                                        </SheetClose>
                                    ))}
                                    {isAuthenticated && (
                                        <SheetClose asChild>
                                            <Link href="/orders" className="flex items-center px-4 py-3 text-base font-medium rounded-xl hover:bg-secondary transition-colors">
                                                {t('orders')}
                                            </Link>
                                        </SheetClose>
                                    )}
                                    {isAuthenticated && user?.role === 'admin' && (
                                        <SheetClose asChild>
                                            <Link href="/admin" className="flex items-center px-4 py-3 text-base font-medium rounded-xl hover:bg-secondary transition-colors">
                                                {t('adminDashboard')}
                                            </Link>
                                        </SheetClose>
                                    )}
                                </nav>

                                <div className="border-t border-border/50 my-2" />

                                <div className="flex flex-col gap-3 px-2">
                                    {isAuthenticated ? (
                                        <>
                                            <SheetClose asChild>
                                                <Link href="/profile">
                                                    <Button variant="outline" className="w-full justify-start rounded-xl">
                                                        {t('profile')}
                                                    </Button>
                                                </Link>
                                            </SheetClose>
                                            <Button
                                                variant="ghost"
                                                className="w-full justify-start text-destructive hover:text-destructive rounded-xl"
                                                onClick={() => {
                                                    logout()
                                                    setIsMobileMenuOpen(false)
                                                }}
                                            >
                                                {t('logout')}
                                            </Button>
                                        </>
                                    ) : (
                                        <>
                                            <SheetClose asChild>
                                                <Link href="/auth/login">
                                                    <Button variant="outline" className="w-full rounded-xl">
                                                        {t('login')}
                                                    </Button>
                                                </Link>
                                            </SheetClose>
                                            <SheetClose asChild>
                                                <Link href="/auth/signup">
                                                    <Button className="w-full rounded-xl">
                                                        {t('signup')}
                                                    </Button>
                                                </Link>
                                            </SheetClose>
                                        </>
                                    )}
                                </div>
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>
            </motion.header>
        </div>
    )
}
